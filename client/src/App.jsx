import Login from "./components/login";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Landing from "./page/Landing";
import Dashbord from "./page/Dashbord";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Layout from "./components/Layout";

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
    <div className="color-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/dashbord"
            element={authUser ? <Dashbord /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/dashbord"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/dashbord"} />}
        />
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
