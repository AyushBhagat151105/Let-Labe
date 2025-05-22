import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isUpdatingProfile: false,
  isResettingPassword: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
    } catch (error) {
      console.error("Auth check failed", error);
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
      toast.success("Signup successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      await axiosInstance.post("/auth/login", data);
      toast.success("Login successful");
      await get().checkAuth(); // Only source of truth
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  verifyEmail: async (token) => {
    try {
      await axiosInstance.post(`/auth/verify-email/${token}`);
      toast.success("Email verified");
    } catch (error) {
      toast.error("Email verification failed");
    }
  },

  resetPassword: async (payload) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.patch("/auth/reset-password", payload);
      toast.success("Password updated you have to login again");
      await get().checkAuth();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  updateUser: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/update-user", data);
      toast.success("Profile updated");
      await get().checkAuth();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
