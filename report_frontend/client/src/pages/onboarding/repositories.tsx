import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Github, Star, GitFork, Clock, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";
import { Repository, UserOrganizationMembership } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function OnboardingRepositories() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [organizations, setOrganizations] = useState<UserOrganizationMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user's organizations
        const userOrgs = await apiService.getUserOrganizations(user.id);
        setOrganizations(userOrgs);
        
        // Get repositories for each organization
        const allRepos: Repository[] = [];
        for (const org of userOrgs) {
          try {
            const orgRepos = await apiService.getRepositories(org.id);
            allRepos.push(...orgRepos);
          } catch (error) {
            console.error(`Failed to load repositories for org ${org.name}:`, error);
          }
        }
        
        setRepositories(allRepos);
        
        // Auto-select all repositories by default
        setSelectedRepos(allRepos.map(repo => repo.id));
        
      } catch (error) {
        console.error("Failed to load onboarding data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleRepository = (repoId: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500", 
      Python: "bg-green-500",
      Go: "bg-cyan-500",
    };
    return colors[language] || "bg-gray-500";
  };

  const handleContinue = async () => {
    setSyncing(true);
    try {
      // Sync repositories from GitHub
      await apiService.syncOnboardingRepositories();
      setLocation("/onboarding/team");
    } catch (error) {
      console.error("Failed to sync repositories:", error);
      // Continue to next step even if sync fails
      setLocation("/onboarding/team");
    } finally {
      setSyncing(false);
    }
  };

  const formatLastSync = (lastSync: string) => {
    if (!lastSync) return "Never synced";
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-background p-4" data-testid="onboarding-repositories">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Select Repositories</h1>
          <p className="text-muted-foreground">
            Choose which repositories you'd like to track in your reports
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Your GitHub Repositories
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-repos"
                disabled={loading}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading repositories...</span>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {repositories.length === 0 ? "No repositories found. Try syncing your GitHub data first." : "No repositories match your search."}
              </div>
            ) : (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`repo-item-${repo.id}`}
                >
                  <Checkbox
                    checked={selectedRepos.includes(repo.id)}
                    onCheckedChange={() => toggleRepository(repo.id)}
                    data-testid={`checkbox-repo-${repo.id}`}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{repo.name}</h3>
                      {repo.visibility === "PRIVATE" && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                      )}
                      {repo.isFork && (
                        <Badge variant="outline" className="text-xs">Fork</Badge>
                      )}
                      {repo.isArchived && (
                        <Badge variant="destructive" className="text-xs">Archived</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{repo.description || "No description available"}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                          <span>{repo.language}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{repo.starsCount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forksCount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatLastSync(repo.lastSync)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => setLocation("/onboarding")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {selectedRepos.length} repositories selected
          </div>
          
          <Button 
            onClick={handleContinue}
            disabled={selectedRepos.length === 0 || syncing || loading}
            data-testid="button-continue"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}