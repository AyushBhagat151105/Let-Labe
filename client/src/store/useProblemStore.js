import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export const useProblemStore = create((set, get) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problem/get-all-problems");
      console.log(res.data.data.problems);

      set({ problems: res.data.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problem/get-problem/${id}`);

      set({ problem: res.data.data.problem });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problem/get-solved-problems");

      set({ solvedProblems: res.data.data });
      console.log(res.data.data);
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },

  deleteProblem: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.delete(`/problem/delete-problem/${id}`);

      toast(res.data.message);

      await get().getAllProblems();
    } catch (error) {
      console.log("Error deleting problems", error);
      toast.error("Error deleting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },
}));
