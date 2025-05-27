import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Editor from "@monaco-editor/react";
import {
  Bookmark,
  ChevronRight,
  Clock,
  Code2,
  FileText,
  Home,
  Lightbulb,
  MessageSquare,
  Play,
  Share2,
  Terminal,
  ThumbsUp,
  Users,
  Award,
  Target,
  Activity,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "@/lib/land";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "@/components/SubmissionsList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();
  const { executeCode, submission, isExecuting } = useExecutionStore();

  const [code, setCode] = useState("");
  const [tab, setTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (tab === "submissions" && id) getSubmissionForProblem(id);
  }, [tab, id]);

  const handleRunCode = () => {
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (err) {
      console.error("Execution error:", err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "MEDIUM":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case "HARD":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-muted";
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this problem: ${problem.title}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Coding Problem",
          text: shareText,
          url: shareUrl,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return <Target className="w-4 h-4" />;
      case "MEDIUM":
        return <Activity className="w-4 h-4" />;
      case "HARD":
        return <Award className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
            <Loader2 className="absolute inset-0 w-16 h-16 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading problem...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Enhanced Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-6"
        >
          <Link
            to="/dashbord"
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Problems</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{problem.title}</span>
        </motion.div>

        {/* Problem Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {problem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={cn(
                      "font-semibold shadow-sm",
                      getDifficultyColor(problem.difficulty)
                    )}
                  >
                    {getDifficultyIcon(problem.difficulty)}
                    <span className="ml-1">{problem.difficulty}</span>
                  </Badge>
                  {problem.company && (
                    <Badge variant="secondary" className="font-medium">
                      {problem.company}
                    </Badge>
                  )}
                  {problem.tags &&
                    problem.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-primary/5 border-primary/20 text-primary"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="hover:bg-primary/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-border/50 shadow-xl h-fit">
              <CardContent className="pt-6">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6 bg-muted/30">
                    <TabsTrigger
                      value="description"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Description</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Code2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Submissions</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="discussion"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Discussion</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span className="hidden sm:inline">Hints</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="text-base leading-relaxed text-foreground">
                        {problem.description}
                      </p>
                    </div>

                    {problem.examples && (
                      <div>
                        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Examples
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(problem.examples).map(
                            ([lang, ex], idx) => (
                              <div
                                key={idx}
                                className="bg-muted/30 border border-border/30 p-4 rounded-xl font-mono text-sm"
                              >
                                <div className="mb-3">
                                  <span className="font-bold text-primary">
                                    Input:
                                  </span>
                                  <div className="mt-1 p-2 bg-background/50 rounded-lg">
                                    {ex.input}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <span className="font-bold text-primary">
                                    Output:
                                  </span>
                                  <div className="mt-1 p-2 bg-background/50 rounded-lg">
                                    {ex.output}
                                  </div>
                                </div>
                                {ex.explanation && (
                                  <div>
                                    <span className="font-bold text-primary">
                                      Explanation:
                                    </span>
                                    <div className="mt-1 p-2 bg-background/50 rounded-lg font-sans">
                                      {ex.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {problem.constraints && (
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">
                          Constraints
                        </h3>
                        <div className="bg-muted/30 border border-border/30 p-4 rounded-xl">
                          <span className="font-mono text-sm">
                            {problem.constraints}
                          </span>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="submissions">
                    <SubmissionsList
                      submissions={submissions}
                      isLoading={isSubmissionsLoading}
                    />
                  </TabsContent>

                  <TabsContent value="discussion">
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="font-semibold mb-2">No discussions yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Be the first to start a discussion about this problem.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="hints">
                    {problem.hints ? (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div className="text-sm text-yellow-800 dark:text-yellow-200">
                            {problem.hints}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="font-semibold mb-2">
                          No hints available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Try solving this problem on your own first.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-border/50 shadow-xl h-fit">
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Code Editor
                  </h2>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-40 bg-background/50 border-border/50">
                        {selectedLanguage}
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(problem.codeSnippets || {}).map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-[500px] rounded-xl overflow-hidden border border-border/30">
                  <Editor
                    height="100%"
                    defaultLanguage={selectedLanguage.toLowerCase()}
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <Button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated: {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{submissionCount} Submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>95% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemPage;
