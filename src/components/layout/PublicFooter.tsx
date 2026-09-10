import { Link } from "react-router-dom";
import { GalleryBrand } from "@/components/common/GalleryBrand";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function PublicFooter() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <GalleryBrand
            to={ROUTES.root}
            markClassName="size-11"
            titleClassName="text-2xl"
            subtitle="Art Gallery Management System"
          />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            A quiet space to discover paintings, portraits and contemporary
            works from emerging and established artists.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to={ROUTES.root} className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to={ROUTES.explore} className="hover:text-foreground">
                Explore
              </Link>
            </li>
            <li>
              <Link to={ROUTES.contact} className="hover:text-foreground">
                Contact
              </Link>
            </li>
            {isAuthenticated ? null : (
              <>
                <li>
                  <Link to={ROUTES.signup} className="hover:text-foreground">
                    Sign up
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.login} className="hover:text-foreground">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <p>© 2026 {APP_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
