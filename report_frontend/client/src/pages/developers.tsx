import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { mockDevelopers } from "@/lib/mock-data";

export default function Developers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevelopers = mockDevelopers.filter(developer =>
    developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="developers-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Developers</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Individual developer profiles and performance</p>
        </div>
        <div className="w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs h-9"
            data-testid="input-search-developers"
          />
        </div>
      </div>

      {/* Developer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredDevelopers.map((developer, index) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              data-testid={`card-developer-${developer.id}`}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                {/* Developer Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarImage src={developer.avatar} alt={developer.name} />
                    <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{developer.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{developer.role}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto text-primary hover:text-primary/80 text-xs sm:text-sm"
                      data-testid={`link-github-${developer.id}`}
                    >
                      <span className="truncate">@{developer.username}</span>
                      <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </Button>
                  </div>
                </div>
                
                {/* Developer Stats */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Commits</span>
                    <span className="font-medium text-green-600" data-testid={`text-developer-${developer.id}-commits`}>
                      {developer.commits}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-medium text-blue-600" data-testid={`text-developer-${developer.id}-reviews`}>
                      {developer.reviews}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">LOC Added</span>
                    <span className="font-medium text-purple-600" data-testid={`text-developer-${developer.id}-loc`}>
                      {developer.linesOfCode}
                    </span>
                  </div>
                </div>
                
                {/* AI Summary */}
                <div className="p-2 sm:p-3 bg-muted rounded-lg mt-auto">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3" data-testid={`text-developer-${developer.id}-summary`}>
                    {developer.aiSummary}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDevelopers.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">No developers found matching your search.</p>
        </div>
      )}
    </motion.div>
  );
}
