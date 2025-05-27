import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useProblemStore } from "@/store/useProblemStore";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { deleteProblem } = useProblemStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const allCompanies = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const companySet = new Set();
    problems.forEach((p) => p.company && companySet.add(p.company));
    return Array.from(companySet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (problem) => difficulty === "ALL" || problem.difficulty === difficulty
      )
      .filter(
        (problem) =>
          selectedTag === "ALL" || problem.tags?.includes(selectedTag)
      )
      .filter(
        (problem) =>
          selectedCompany === "ALL" || problem.company === selectedCompany
      );
  }, [problems, search, difficulty, selectedTag, selectedCompany]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteProblem(id);
    } catch (error) {
      console.log(error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700";
      case "MEDIUM":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700";
      case "HARD":
        return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/40 shadow-md">
          {/* Header Title + Filters Active Info */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Problem Set
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProblems.length} problem
                {filteredProblems.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filters active</span>
            </div>
          </div>

          {/* Filters Grid - compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 py-2 text-sm bg-background/60 border-border/40 focus:bg-background transition-colors rounded-md"
              />
            </div>

            {/* Difficulty */}
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="py-2 text-sm bg-background/60 border-border/40 focus:bg-background transition-colors rounded-md">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Difficulties</SelectItem>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          diff === "EASY"
                            ? "bg-green-500"
                            : diff === "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      />
                      {diff.charAt(0) + diff.slice(1).toLowerCase()}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tags */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="py-2 text-sm bg-background/60 border-border/40 focus:bg-background transition-colors rounded-md">
                <SelectValue placeholder="Select Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Company */}
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="py-2 text-sm bg-background/60 border-border/40 focus:bg-background transition-colors rounded-md">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Companies</SelectItem>
                {allCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/40 border-border/50">
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Tags
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Difficulty
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Company
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  {authUser?.role === "ADMIN" && "Action"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem, index) => {
                  const isSolved = problem?.solvedBy?.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <TableRow
                      key={problem.id}
                      className="hover:bg-muted/20 transition-colors duration-200 border-border/30 group"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isSolved}
                            readOnly
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                          {isSolved && (
                            <span className="text-xs text-green-600 font-medium">
                              Solved
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Link
                          to={`dashbord/problem/${problem.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
                        >
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(problem.tags || []).slice(0, 3).map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs font-medium bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {problem.tags && problem.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-muted"
                            >
                              +{problem.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={cn(
                            "text-white text-xs font-semibold px-3 py-1 shadow-sm transition-all duration-300",
                            getDifficultyColor(problem.difficulty)
                          )}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {problem.company ? (
                          <Badge variant="secondary" className="font-medium">
                            {problem.company}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 hover:scale-105 transition-transform duration-200"
                              onClick={() => handleDelete(problem.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled
                              className="h-8 w-8 p-0"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        No problems found
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        Try adjusting your search or filter criteria to find
                        what you're looking for.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="bg-muted/20 border-t border-border/50 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProblems.length)}{" "}
                of {filteredProblems.length} problems
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemTable;
