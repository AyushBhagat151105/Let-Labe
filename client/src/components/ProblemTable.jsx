import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
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
      );
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteProblem(id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddToPlaylist = (id) => {};

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Top Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <Button onClick={() => {}} className="gap-2 text-white">
          <Plus className="w-4 h-4 " />
          Create Playlist
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Difficulties</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full md:w-40">
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
      </div>

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Solved</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem?.solvedBy?.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <TableRow key={problem.id}>
                    <TableCell>
                      <Checkbox checked={isSolved} readOnly />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs font-bold"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-white text-xs font-semibold",
                          problem.difficulty === "EASY"
                            ? "bg-green-500"
                            : problem.difficulty === "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      >
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row gap-2">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => handleDelete(problem.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary" disabled>
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToPlaylist(problem.id)}
                          className="gap-2"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="text-sm px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProblemTable;
