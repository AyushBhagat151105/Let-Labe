import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, Outlet } from "react-router-dom";
import LogoutButtone from "./LogoutButtone";

function NavBar() {
  const { authUser } = useAuthStore();

  return (
    <nav className="border-b border-border shadow-sm py-4 px-8 bg-card">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashbord" className="text-xl font-bold text-primary">
          Leetlab
        </Link>

        {/* Right Side */}
        <div className="relative group">
          <img
            src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-border"
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 mt-2 w-56 bg-card text-foreground border border-border rounded-xl shadow-lg 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 
              transition-all duration-300 flex flex-col space-y-2 p-4 z-50"
          >
            <div>
              <p className="text-sm font-semibold">{authUser?.name}</p>
              <hr className="my-2 border-muted" />
            </div>
            <Link
              to="profile"
              className="flex items-center text-sm hover:text-primary transition-colors"
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Link>
            {authUser?.role === "ADMIN" && (
              <Link
                to="add-problem"
                className="flex items-center text-sm hover:text-primary transition-colors"
              >
                <Code className="w-4 h-4 mr-2" />
                Add Problem
              </Link>
            )}
            <LogoutButtone className="flex items-center text-sm hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </LogoutButtone>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
