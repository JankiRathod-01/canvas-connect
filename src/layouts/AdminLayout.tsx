import { NavLink, Outlet } from "react-router-dom";
import { LogoutButton } from "@/components/common/LogoutButton";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const adminNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/10 text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

export function AdminLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-semibold sm:text-xl">
              {APP_NAME}
            </p>
            {currentUser ? (
              <p className="truncate text-xs text-muted-foreground">
                Admin · {currentUser.name}
              </p>
            ) : null}
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex flex-wrap gap-1 border-b border-border pb-3">
          <NavLink to={ROUTES.admin} end className={adminNavLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to={ROUTES.adminVisitors} className={adminNavLinkClass}>
            Visitors
          </NavLink>
          <NavLink to={ROUTES.adminArtists} className={adminNavLinkClass}>
            Artist accounts
          </NavLink>
          <NavLink to={ROUTES.adminArtistProfiles} className={adminNavLinkClass}>
            Artist profiles
          </NavLink>
          <NavLink to={ROUTES.adminCategories} className={adminNavLinkClass}>
            Categories
          </NavLink>
          <NavLink to={ROUTES.adminArtworks} className={adminNavLinkClass}>
            Artworks
          </NavLink>
          <NavLink to={ROUTES.adminExhibitions} className={adminNavLinkClass}>
            Exhibitions
          </NavLink>
          <NavLink to={ROUTES.adminInquiries} className={adminNavLinkClass}>
            Inquiries
          </NavLink>
          <NavLink to={ROUTES.adminOrders} className={adminNavLinkClass}>
            Orders
          </NavLink>
          <NavLink to={ROUTES.adminReports} className={adminNavLinkClass}>
            Reports
          </NavLink>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
