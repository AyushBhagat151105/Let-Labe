import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { signup, isSigninUp } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await signup(data);
      console.log("Sign up data:- ", data);

      if (res?.statusCode === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error in Sign up data:- ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-card px-4 w-screen">
      <div className="w-full max-w-md bg-card bg-opacity-90 p-10 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-wide">
          Create Account
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-7"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      className="text-base px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="text-base px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pr-12 text-white bg-gray-700 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSigninUp}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 font-semibold rounded-md flex justify-center items-center gap-2 transition"
            >
              {isSigninUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign up"
              )}
            </Button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 underline hover:text-indigo-300 transition"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
