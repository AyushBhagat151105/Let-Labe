import React from "react";
import { motion } from "motion/react";

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
    </div>
  );
}

export default Dashboard;
