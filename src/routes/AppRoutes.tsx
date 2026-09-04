import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/roles";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { ArtistHomePage } from "@/features/artist/pages/ArtistHomePage";
import { ContactPage } from "@/features/contact/pages/ContactPage";
import { ExplorePage } from "@/features/explore/pages/ExplorePage";
import { ArtistsPage } from "@/features/users/pages/ArtistsPage";
import { VisitorsPage } from "@/features/users/pages/VisitorsPage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ArtistLayout } from "@/layouts/ArtistLayout";
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
        <Route path={ROUTES.explore} element={<ExplorePage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.unauthorized} element={<Unauthorized />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.admin]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.admin} element={<AdminHomePage />} />
          <Route path={ROUTES.adminVisitors} element={<VisitorsPage />} />
          <Route path={ROUTES.adminArtists} element={<ArtistsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.artist]} />}>
        <Route element={<ArtistLayout />}>
          <Route path={ROUTES.artist} element={<ArtistHomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
