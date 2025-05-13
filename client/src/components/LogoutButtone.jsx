import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Button } from "./ui/button";

function LogoutButtone({ children }) {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="destructive" onClick={onLogout}>
      {children}
    </Button>
  );
}

export default LogoutButtone;
