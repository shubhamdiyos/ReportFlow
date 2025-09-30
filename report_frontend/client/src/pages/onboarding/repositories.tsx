import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Github, Star, GitFork, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock repositories that would come from GitHub API
const mockRepositories = [
  {
    id: "1",
    name: "awesome-project",
    fullName: "alexdev/awesome-project", 
    description: "A really awesome web application built with React and Node.js",
    language: "TypeScript",
    stars: 245,
    forks: 56,
    lastActivity: "2 days ago",
    isPrivate: false
  },
  {
    id: "2", 
    name: "data-pipeline",
    fullName: "alexdev/data-pipeline",
    description: "Scalable data processing pipeline for analytics",
    language: "Python",
    stars: 89,
    forks: 23,
    lastActivity: "1 week ago",
    isPrivate: true
  },
  {
    id: "3",
    name: "mobile-app",
    fullName: "alexdev/mobile-app", 
    description: "Cross-platform mobile application using React Native",
    language: "JavaScript",
    stars: 156,
    forks: 34,
    lastActivity: "3 days ago",
    isPrivate: false
  },
  {
    id: "4",
    name: "api-service",
    fullName: "alexdev/api-service",
    description: "RESTful API service with authentication and rate limiting",
    language: "Go",
    stars: 67,
    forks: 12,
    lastActivity: "5 days ago", 
    isPrivate: true
  },
  {
    id: "5",
    name: "docs-site",
    fullName: "alexdev/docs-site",
    description: "Documentation website built with Gatsby",
    language: "JavaScript",
    stars: 34,
    forks: 8,
    lastActivity: "1 month ago",
    isPrivate: false
  }
];

export default function OnboardingRepositories() {
  const [, setLocation] = useLocation();
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = mockRepositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-repos"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredRepos.map((repo) => (
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
                    {repo.isPrivate && (
                      <Badge variant="secondary" className="text-xs">Private</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{repo.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                      <span>{repo.language}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stars}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{repo.forks}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{repo.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            onClick={() => setLocation("/onboarding/team")}
            disabled={selectedRepos.length === 0}
            data-testid="button-continue"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}