import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Code-smas Test
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          it's a simple test to check your coding skills. You can use any
          programming language to solve the problems. You can use js, py and
          java
        </p>
      </div>
      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4 z-10 relative">
        <button
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-neutral-200 transition duration-300 ease-out border border-neutral-700 rounded-lg shadow-md group hover:shadow-blue-500/40"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-blue-900/30 opacity-50 group-hover:opacity-100 transition-all duration-300 blur-sm"></span>
          <span className="absolute inset-0 w-full h-full border border-blue-500 rounded-lg opacity-20 group-hover:opacity-60"></span>
          <span className="relative z-10">Login</span>
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-neutral-200 transition duration-300 ease-out border border-neutral-700 rounded-lg shadow-md group hover:shadow-green-500/40"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-600/20 to-green-900/30 opacity-50 group-hover:opacity-100 transition-all duration-300 blur-sm"></span>
          <span className="absolute inset-0 w-full h-full border border-green-500 rounded-lg opacity-20 group-hover:opacity-60"></span>
          <span className="relative z-10">Sign Up</span>
        </button>
      </div>

      <BackgroundBeams />
    </div>
  );
}

export default Landing;
