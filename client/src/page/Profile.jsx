import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Home, ChevronRight, CheckCircle, ThumbsUp, Clock } from "lucide-react";
import { useProblemStore } from "@/store/useProblemStore";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { motion, AnimatePresence } from "motion/react";

const fadeSlideVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { getSolvedProblemByUser, solvedProblems, isProblemLoading } =
    useProblemStore();
  const [activeTab, setActiveTab] = useState("solved");

  useEffect(() => {
    getSolvedProblemByUser();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground select-none">
        <Home className="w-5 h-5 text-muted-foreground" />
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground">Profile</span>
      </nav>

      {/* Header */}
      <header className="space-y-2 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Your Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          View your solved problems and personal stats.
        </p>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-muted rounded-lg p-1 flex gap-2">
          <TabsTrigger
            value="solved"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "solved"
                ? "bg-primary text-white shadow"
                : "hover:bg-muted-foreground/10 text-muted-foreground"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Solved
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "stats"
                ? "bg-primary text-white shadow"
                : "hover:bg-muted-foreground/10 text-muted-foreground"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "solved" && (
            <motion.div
              key="solved"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeSlideVariant}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-white">
                Your Solved Problems
              </h2>

              {isProblemLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-28 w-full rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : solvedProblems.length === 0 ? (
                <p className="text-center text-muted-foreground italic mt-10">
                  You haven’t solved any problems yet.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {solvedProblems.map((problem) => (
                    <motion.div
                      key={problem.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <Card className="bg-card text-white border border-border hover:border-primary transition-colors duration-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-primary hover:underline">
                              <Link
                                to={`/dashbord/dashbord/problem/${problem.id}`}
                              >
                                {problem.title}
                              </Link>
                            </CardTitle>
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {problem.description?.substring(0, 120)}...
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeSlideVariant}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-3xl mx-auto"
            >
              <ProfileSettingsForm />
              <div className="bg-muted p-8 rounded-xl text-center shadow">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground">
                  Stats and charts about your performance will appear here.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
