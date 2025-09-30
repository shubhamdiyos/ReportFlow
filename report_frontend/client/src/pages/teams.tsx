import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { mockTeams } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Teams() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="teams-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Manage and monitor your development teams</p>
        </div>
        <Button className="w-full sm:w-auto" size="sm" data-testid="button-add-team">
          <Plus className="w-4 h-4 mr-2" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              data-testid={`card-team-${team.id}`}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground flex-1 min-w-0">{team.name}</h3>
                  <Badge 
                    variant={team.status === "active" ? "default" : "secondary"}
                    className={cn(
                      "text-xs flex-shrink-0",
                      team.status === "active" && "bg-green-500/10 text-green-700",
                      team.status === "planning" && "bg-yellow-500/10 text-yellow-700"
                    )}
                  >
                    {team.status === "active" ? "Active" : "Planning"}
                  </Badge>
                </div>
                
                {/* Team Members */}
                <div className="flex -space-x-2 mb-3 sm:mb-4">
                  {team.members.slice(0, 3).map((member) => (
                    <Avatar key={member.id} className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {team.memberCount > 3 && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{team.memberCount - 3}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Team Stats */}
                <div className="space-y-2 sm:space-y-3 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium" data-testid={`text-team-${team.id}-members`}>
                      {team.memberCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium text-green-600" data-testid={`text-team-${team.id}-commits`}>
                      {team.commits} commits
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pull Requests</span>
                    <span className="font-medium text-blue-600" data-testid={`text-team-${team.id}-prs`}>
                      {team.prs} merged
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
