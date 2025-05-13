import Login from "./components/login";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Landing from "./page/Landing";
import Dashbord from "./page/Dashbord";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen color-background">
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/dashbord"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/dashbord"} />}
        />
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashbord"
          element={authUser ? <Dashbord /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
