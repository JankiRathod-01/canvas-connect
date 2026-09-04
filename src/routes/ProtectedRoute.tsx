import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { userHasAllowedRole } from "@/utils/roleRedirect";

interface ProtectedRouteProps {
  allowedRoles?: readonly string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, currentUser } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingScreen message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !userHasAllowedRole(currentUser?.role, allowedRoles)
  ) {
    return <Navigate to={ROUTES.unauthorized} replace />;
  }

  return <Outlet />;
}
