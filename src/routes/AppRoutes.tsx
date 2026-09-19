import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/roles";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { ArtistHomePage } from "@/features/artist/pages/ArtistHomePage";
import { ArtistProfilesPage } from "@/features/artistProfiles/pages/ArtistProfilesPage";
import { ContactPage } from "@/features/contact/pages/ContactPage";
import { ExplorePage } from "@/features/explore/pages/ExplorePage";
import { PublicExhibitionDetailPage } from "@/features/exhibitions/pages/PublicExhibitionDetailPage";
import { PublicExhibitionsPage } from "@/features/exhibitions/pages/PublicExhibitionsPage";
import { VisitorHomePage } from "@/features/visitor/pages/VisitorHomePage";
import { ArtistsPage } from "@/features/users/pages/ArtistsPage";
import { VisitorsPage } from "@/features/users/pages/VisitorsPage";
import { CategoriesPage } from "@/features/categories/pages/CategoriesPage";
import { ArtworksPage } from "@/features/artworks/pages/ArtworksPage";
import { ExhibitionsPage } from "@/features/exhibitions/pages/ExhibitionsPage";
import { InquiriesPage } from "@/features/inquiries/pages/InquiriesPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { MyOrdersPage } from "@/features/orders/pages/MyOrdersPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
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
        <Route path={ROUTES.exhibitions} element={<PublicExhibitionsPage />} />
        <Route
          path="/exhibitions/:exhibitionId"
          element={<PublicExhibitionDetailPage />}
        />
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
          <Route
            path={ROUTES.adminArtistProfiles}
            element={<ArtistProfilesPage />}
          />
          <Route path={ROUTES.adminCategories} element={<CategoriesPage />} />
          <Route path={ROUTES.adminArtworks} element={<ArtworksPage />} />
          <Route path={ROUTES.adminExhibitions} element={<ExhibitionsPage />} />
          <Route path={ROUTES.adminInquiries} element={<InquiriesPage />} />
          <Route path={ROUTES.adminOrders} element={<OrdersPage />} />
          <Route path={ROUTES.adminReports} element={<ReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.artist]} />}>
        <Route element={<ArtistLayout />}>
          <Route path={ROUTES.artist} element={<ArtistHomePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.visitor]} />}>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.visitor} element={<VisitorHomePage />} />
          <Route path={ROUTES.visitorOrders} element={<MyOrdersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
