import React, { useState, useEffect } from "react";
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
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-muted-foreground">Loading problem...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="flex items-center gap-1 text-primary">
          <Home className="w-4 h-4" /> <ChevronRight className="w-4 h-4" />
        </Link>
        <span className="font-semibold">{problem.title}</span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger
                  value="description"
                  className="flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Description
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="flex items-center gap-1"
                >
                  <Code2 className="w-4 h-4" /> Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" /> Discussion
                </TabsTrigger>
                <TabsTrigger value="hints" className="flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> Hints
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <p className="mb-4 text-base leading-relaxed">
                  {problem.description}
                </p>
                {problem.examples && (
                  <>
                    <h3 className="font-semibold mb-2">Examples:</h3>
                    {Object.entries(problem.examples).map(([lang, ex], idx) => (
                      <div
                        key={idx}
                        className="bg-muted p-4 rounded-lg mb-4 font-mono"
                      >
                        <div className="mb-2">
                          <span className="font-bold text-sm">Input:</span>{" "}
                          {ex.input}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold text-sm">Output:</span>{" "}
                          {ex.output}
                        </div>
                        {ex.explanation && (
                          <div>
                            <span className="font-bold text-sm">
                              Explanation:
                            </span>{" "}
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {problem.constraints && (
                  <div className="bg-muted p-4 rounded-lg">
                    <span className="font-mono">{problem.constraints}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submissions">
                {/* {console.log(submissions)} */}

                <SubmissionsList
                  submissions={submissions}
                  isLoading={isSubmissionsLoading}
                />
              </TabsContent>

              <TabsContent value="discussion">
                <p className="text-sm text-muted-foreground">
                  No discussions yet.
                </p>
              </TabsContent>

              <TabsContent value="hints">
                {problem.hints ? (
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    {problem.hints}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hints available.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Code Editor
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? "text-primary" : ""}`}
                  />
                </Button>
                <Button size="icon" variant="ghost">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-32">
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

            <div className="h-[500px]">
              <Editor
                height="100%"
                defaultLanguage={selectedLanguage.toLowerCase()}
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
              />
            </div>

            <Button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" /> Run Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground mt-4">
        <Clock className="inline w-4 h-4 mr-1" /> Updated:{" "}
        {new Date(problem.createdAt).toLocaleDateString()}
        <span className="mx-2">•</span>
        <Users className="inline w-4 h-4 mr-1" /> {submissionCount} Submissions
        <span className="mx-2">•</span>
        <ThumbsUp className="inline w-4 h-4 mr-1" /> 95% Success Rate
      </div>
    </div>
  );
};

export default ProblemPage;
