import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  const avgMemory =
    memoryArr.reduce((sum, m) => sum + parseFloat(m), 0) / memoryArr.length;

  const avgTime =
    timeArr.reduce((sum, t) => sum + parseFloat(t), 0) / timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-lg font-semibold ${
                submission.status === "Accepted"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submission.status}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {successRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{avgTime.toFixed(3)} s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {avgMemory.toFixed(0)} KB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Cases Results</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Expected</th>
                <th className="p-2 text-left">Your Output</th>
                <th className="p-2 text-left">Memory</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCases.map((testCase) => (
                <tr
                  key={testCase.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="p-2">
                    {testCase.passed ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Passed
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        Failed
                      </div>
                    )}
                  </td>
                  <td className="p-2 font-mono">{testCase.expected}</td>
                  <td className="p-2 font-mono">{testCase.stdout || "null"}</td>
                  <td className="p-2">{testCase.memory}</td>
                  <td className="p-2">{testCase.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionResults;
