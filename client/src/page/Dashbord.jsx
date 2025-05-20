import React from "react";
import { motion } from "motion/react";
import ProblemTable from "@/components/ProblemTable";
import { useProblemStore } from "@/store/useProblemStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
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
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  const welcomeMessage = "Welcome to your dashboard!";
  const words = welcomeMessage.split(" ");

  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <motion.h1
        className="text-2xl font-bold mb-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-2"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
      <p className="text-muted-foreground">
        Here you can manage your problems and submissions.
      </p>

      {problems?.length > 0 ? (
        <ProblemTable problems={problems} />
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
      )}
    </div>
  );
}

export default Dashboard;
