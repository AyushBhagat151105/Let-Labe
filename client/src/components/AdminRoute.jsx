import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = () => {
  const { authUser } = useAuthStore();

  // console.log(authUser);

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (authUser.role !== "ADMIN") {
    return <Navigate to="/dashbord" />;
  }

  return <Outlet />;
};

export default AdminRoute;
