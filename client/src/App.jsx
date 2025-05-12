import Login from "./components/login";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Landing from "./page/Landing";
import Dashbord from "./page/Dashbord";

function App() {
  return (
    <div className="flex justify-center items-center h-screen color-background">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/bord" element={<Dashbord />} />
      </Routes>
    </div>
  );
}

export default App;
