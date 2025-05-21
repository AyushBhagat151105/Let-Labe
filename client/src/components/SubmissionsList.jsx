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
        const memoryArray = safeParse(submission.memory);
        const timeArray = safeParse(submission.time);
        const isExpanded = expandedId === submission.id;

        return (
          <Card
            key={submission.id}
            className="hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
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
                <div className="mt-4 bg-muted/30 p-3 rounded-lg text-sm">
                  <div className="font-medium mb-2">Test Case Results:</div>
                  <div className="space-y-1">
                    {timeArray.map((t, index) => {
                      const time = parseFloat(t.split(" ")[0]);
                      const mem = memoryArray[index]
                        ? parseFloat(memoryArray[index].split(" ")[0])
                        : 0;
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center px-2 py-1 rounded hover:bg-muted/50"
                        >
                          <span className="text-muted-foreground">
                            Test Case #{index + 1}
                          </span>
                          <div className="flex gap-4 text-muted-foreground">
                            <span>
                              <Clock className="inline w-4 h-4 mr-1" />
                              {time.toFixed(3)} s
                            </span>
                            <span>
                              <Memory className="inline w-4 h-4 mr-1" />
                              {mem.toFixed(0)} KB
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
