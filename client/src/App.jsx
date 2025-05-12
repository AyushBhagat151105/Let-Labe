import Login from "./components/login";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Landing from "./page/Landing";
import Dashbord from "./page/Dashbord";

function App() {
  let authUser = null;
  return (
    <div className="flex justify-center items-center h-screen color-background">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route
          index
          element={authUser ? <Dashbord /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
