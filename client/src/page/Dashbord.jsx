import React from "react";
import { motion } from "motion/react";
import ProblemTable from "@/components/ProblemTable";
import { useProblemStore } from "@/store/useProblemStore";
import { useEffect } from "react";
import { Loader, Code2, TrendingUp, Target } from "lucide-react";


const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

function Dashboard() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
            <Loader className="absolute inset-0 w-16 h-16 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  const welcomeMessage = "Welcome to your dashboard!";
  const words = welcomeMessage.split(" ");

  // Calculate stats
  const totalProblems = problems?.length || 0;
  const easyProblems =
    problems?.filter((p) => p.difficulty === "EASY").length || 0;
  const mediumProblems =
    problems?.filter((p) => p.difficulty === "MEDIUM").length || 0;
  const hardProblems =
    problems?.filter((p) => p.difficulty === "HARD").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto p-6 max-w-7xl">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                ease: "easeInOut",
              },
            },
          }}
          className="mb-10 text-center"
        >
          <motion.h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
            Welcome to your Dashboard
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
          >
            Track your progress, solve challenging problems, and level up your
            coding skills.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        {totalProblems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div
              variants={cardVariants}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Total Problems
                </h3>
              </div>
              <p className="text-3xl font-bold text-primary">{totalProblems}</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground">Easy</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">
                {easyProblems}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-foreground">Medium</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-500">
                {mediumProblems}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-foreground">Hard</h3>
              </div>
              <p className="text-3xl font-bold text-red-500">{hardProblems}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Problems Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {problems?.length > 0 ? (
            <ProblemTable problems={problems} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
                  <Code2 className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No Problems Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding some coding problems to track your
                  progress.
                </p>
                <div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                  <p className="font-medium text-primary">
                    Ready to start coding?
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
