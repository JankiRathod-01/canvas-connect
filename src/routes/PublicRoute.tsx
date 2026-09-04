import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { getPostLoginPath } from "@/utils/roleRedirect";

export function PublicRoute() {
  const { isAuthenticated, isInitializing, currentUser } = useAuth();

  if (isInitializing) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={getPostLoginPath(currentUser?.role)} replace />;
  }

  return <Outlet />;
}
