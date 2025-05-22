import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubmissionsList = ({ submissions, isLoading }) => {
  const [expandedId, setExpandedId] = useState(null);

  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const calculateAverage = (data) => {
    const arr = safeParse(data).map((val) => parseFloat(val.split(" ")[0]));
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const avgMemory = calculateAverage(submission.memory);
        const avgTime = calculateAverage(submission.time);
        const isExpanded = expandedId === submission.id;
        const testCases = submission.TestCaseResult || [];

        return (
          <Card
            key={submission.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start flex-wrap gap-4">
                {/* Status and Language */}
                <div className="flex items-center gap-4">
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">{submission.status}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {submission.language}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {avgTime.toFixed(3)} s
                  </div>
                  <div className="flex items-center gap-1">
                    <Memory className="w-4 h-4" />
                    {avgMemory.toFixed(0)} KB
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : submission.id)
                    }
                    className="ml-2 text-muted-foreground hover:text-primary transition"
                  >
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
              </div>

              {/* Expanded Test Case Details */}
              {isExpanded && (
                <div className="mt-4 bg-muted/20 p-4 rounded-lg text-sm space-y-2">
                  <div className="font-semibold text-muted-foreground mb-2">
                    Test Case Results:
                  </div>
                  {testCases.map((tc, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-4 border transition-all duration-300 bg-zinc-900 ${
                        tc.passed ? "border-green-600/30" : "border-red-600/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tc.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className="font-medium text-zinc-300">
                            Test Case #{tc.testCase}
                          </span>
                        </div>
                        <div className="text-sm text-zinc-400 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {tc.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Memory className="w-4 h-4" />
                            {tc.memory}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                        <div className="bg-zinc-800 p-3 rounded-md border border-zinc-700">
                          <span className="block text-xs font-semibold text-zinc-400 mb-1">
                            Expected
                          </span>
                          <code className="block text-zinc-200 whitespace-pre-wrap">
                            {tc.expected}
                          </code>
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-md border border-zinc-700">
                          <span className="block text-xs font-semibold text-zinc-400 mb-1">
                            Stdout
                          </span>
                          <code className="block text-zinc-200 whitespace-pre-wrap">
                            {tc.stdout}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
