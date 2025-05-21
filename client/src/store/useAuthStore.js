import { create } from "zustand";

import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("💀 Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);

      set({ authUser: res.data.user });

      toast(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("In store", res.data.data);

      set({ authUser: res.data.data });

      toast(res.data.message);

      return res;
    } catch (error) {
      console.log("Error logging in", error);
      toast("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast("Error logging out");
    }
  },

  verifyemail: async (token) => {
    try {
      await axiosInstance.post(`/auth/verify-email/${token}`);
      toast.success("verify-email successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));
