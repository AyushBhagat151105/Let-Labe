import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  FileText,
  ThumbsUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useProblemStore } from "@/store/useProblemStore";

export default function ProfilePage() {
  const { getSolvedProblemByUser, solvedProblems, isProblemLoading } =
    useProblemStore();

  const [activeTab, setActiveTab] = useState("solved");

  useEffect(() => {
    getSolvedProblemByUser();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Profile</span>
          </div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            View your solved problems and stats.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="solved">
            <CheckCircle className="w-4 h-4 mr-2" />
            Solved Problems
          </TabsTrigger>
          <TabsTrigger value="stats">
            <ThumbsUp className="w-4 h-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solved">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Solved Problems</h2>
            {isProblemLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : solvedProblems.length === 0 ? (
              <p className="text-center text-muted-foreground">
                You haven’t solved any problems yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {solvedProblems.map((problem) => (
                  <Card key={problem.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          <Link
                            to={`/dashbord/dashbord/problem/${problem.id}`}
                            className="hover:underline text-primary"
                          >
                            {problem.title}
                          </Link>
                        </CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {problem.description?.substring(0, 120)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="bg-muted p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              Stats and charts about your performance will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
