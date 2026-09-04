import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/roles";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminHomePage } from "@/pages/AdminHome";
import { HomePage } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Unauthorized } from "@/pages/Unauthorized";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.root} element={<HomePage />} />
        <Route path={ROUTES.unauthorized} element={<Unauthorized />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.admin]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.admin} element={<AdminHomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
