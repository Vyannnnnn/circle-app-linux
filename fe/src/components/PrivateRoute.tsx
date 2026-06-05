import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../redux/hooks";

export default function PrivateRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
