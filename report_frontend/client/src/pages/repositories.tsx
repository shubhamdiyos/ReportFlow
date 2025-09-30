import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw, 
  GitBranch, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  GitFork
} from "lucide-react";
import { mockRepositories } from "@/lib/mock-data";
import { Repository } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Repositories() {
  const { toast } = useToast();
  const [repositories, setRepositories] = useState(mockRepositories);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "synced" | "failed" | "pending">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncingRepoId, setSyncingRepoId] = useState<string | null>(null);

  // Filter repositories based on search and status
  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && repo.included) ||
                         (statusFilter === "inactive" && !repo.included) ||
                         (statusFilter === "synced" && repo.syncStatus === "success") ||
                         (statusFilter === "failed" && repo.syncStatus === "failed") ||
                         (statusFilter === "pending" && repo.syncStatus === "pending");
    return matchesSearch && matchesStatus;
  });

  const handleToggleRepo = (repoId: string) => {
    setRepositories(prev => prev.map(repo => 
      repo.id === repoId ? { ...repo, included: !repo.included } : repo
    ));
    toast({
      title: "Repository Updated",
      description: "Repository tracking status has been updated.",
    });
  };

  const handleSyncRepo = async (repoId: string) => {
    setSyncingRepoId(repoId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRepositories(prev => prev.map(repo => 
        repo.id === repoId ? { 
          ...repo, 
          syncStatus: "success", 
          lastSync: "Just now" 
        } : repo
      ));
      toast({
        title: "Sync Complete",
        description: "Repository has been successfully synced.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "There was an error syncing the repository.",
        variant: "destructive",
      });
    } finally {
      setSyncingRepoId(null);
    }
  };

  const handleRemoveRepo = (repoId: string) => {
    setRepositories(prev => prev.filter(repo => repo.id !== repoId));
    setSelectedRepo(null);
    toast({
      title: "Repository Removed",
      description: "Repository has been removed from tracking.",
    });
  };

  const handleAddRepository = async () => {
    if (!newRepoUrl.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call to add repository
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extract repo name from URL (simplified)
      const repoName = newRepoUrl.split('/').pop()?.replace('.git', '') || 'new-repo';
      
      const newRepo = {
        id: String(repositories.length + 1),
        name: repoName,
        description: "Added repository",
        language: "TypeScript",
        visibility: "private" as const,
        commits: 0,
        lastSync: "Never",
        syncStatus: "pending" as const,
        included: true
      };
      
      setRepositories(prev => [...prev, newRepo]);
      setNewRepoUrl("");
      setShowAddModal(false);
      
      toast({
        title: "Repository Added",
        description: "Repository has been successfully added for tracking.",
      });
    } catch (error) {
      toast({
        title: "Failed to Add Repository",
        description: "There was an error adding the repository.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSyncStatusBadge = (status: Repository['syncStatus']) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-950">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-600 dark:bg-red-950">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sync Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-950">
            <Clock className="w-3 h-3 mr-1" />
            Pending Sync
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  };

  const handleSyncAll = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setRepositories(prev => prev.map(repo => ({
        ...repo,
        syncStatus: "success",
        lastSync: "Just now"
      })));
      toast({
        title: "All Repositories Synced",
        description: "All repositories have been successfully synced.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "There was an error syncing repositories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="repositories-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Repository Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Control which GitHub repositories are tracked and monitored</p>
        </div>
        <div className="w-full sm:w-auto">
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" size="sm" data-testid="button-add-repository">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Repository</span>
                <span className="sm:hidden">Add Repo</span>
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-add-repository">
              <DialogHeader>
                <DialogTitle>Add Repository</DialogTitle>
                <DialogDescription>
                  Enter the GitHub repository URL or select from your connected organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-url">Repository URL</Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    data-testid="input-repo-url"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  data-testid="button-cancel-add"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRepository}
                  disabled={!newRepoUrl.trim() || isLoading}
                  data-testid="button-confirm-add"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Repository"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleSyncAll} 
            disabled={isLoading}
            data-testid="button-sync-all"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            {isLoading ? "Syncing..." : "Sync All"}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card data-testid="card-search-filters">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-repos"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Repositories</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
                <SelectItem value="synced">Successfully Synced</SelectItem>
                <SelectItem value="failed">Sync Failed</SelectItem>
                <SelectItem value="pending">Pending Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Repository List */}
      <Card data-testid="card-repositories">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Connected Repositories ({filteredRepositories.length})</span>
            <div className="text-sm text-muted-foreground">
              {repositories.filter(r => r.included).length} active • {repositories.filter(r => !r.included).length} inactive
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage repository tracking, sync status, and remove repositories from monitoring
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredRepositories.length === 0 ? (
            <div className="p-8 text-center">
              <GitFork className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No repositories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filters." : "Add your first repository to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first-repo">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Repository
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredRepositories.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 flex items-center justify-between hover:bg-accent/50 transition-colors"
                  data-testid={`repo-item-${repo.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      repo.language === "TypeScript" && "bg-primary/10",
                      repo.language === "JavaScript" && "bg-blue-500/10"
                    )}>
                      <GitBranch className={cn(
                        "w-5 h-5",
                        repo.language === "TypeScript" && "text-primary",
                        repo.language === "JavaScript" && "text-blue-500"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-foreground">{repo.name}</h3>
                        {getSyncStatusBadge(repo.syncStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {repo.visibility}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last sync: {repo.lastSync}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {repo.commits} commits this month
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Tracking:</span>
                      <Switch 
                        checked={repo.included} 
                        onCheckedChange={() => handleToggleRepo(repo.id)}
                        aria-label={`Toggle tracking for ${repo.name}`}
                        data-testid={`switch-repo-${repo.id}-included`}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          aria-label={`Actions for ${repo.name}`}
                          data-testid={`button-repo-actions-${repo.id}`}
                        >
                          <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleSyncRepo(repo.id)}
                          disabled={syncingRepoId === repo.id || isLoading}
                          data-testid={`action-sync-${repo.id}`}
                        >
                          <RotateCcw className={cn("w-4 h-4 mr-2", syncingRepoId === repo.id && "animate-spin")} aria-hidden="true" />
                          {syncingRepoId === repo.id ? "Syncing..." : "Sync Now"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setSelectedRepo(repo.id)}
                          className="text-red-600 focus:text-red-600"
                          data-testid={`action-remove-${repo.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Repository Confirmation */}
      <AlertDialog open={!!selectedRepo} onOpenChange={(open) => !open && setSelectedRepo(null)}>
        <AlertDialogContent data-testid="dialog-remove-repo">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Repository</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this repository from tracking? This action cannot be undone.
              All historical data for this repository will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-remove">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedRepo && handleRemoveRepo(selectedRepo)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-remove"
            >
              Remove Repository
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
