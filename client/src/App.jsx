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
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/dashbord" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/dashbord" />}
        />
        <Route
          path="/dashbord"
          element={authUser ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashbord />} />
          <Route path="profile" element={<div>Profile Page</div>} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
