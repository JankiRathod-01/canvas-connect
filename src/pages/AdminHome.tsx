import { Link } from "react-router-dom";
import { Images, Users, ShieldCheck, MessageSquare, Tags, CalendarDays, BarChart3, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function AdminHomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Admin dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome to {APP_NAME}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hello {currentUser?.name}. Manage visitor and artist accounts from
          the grids below.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-xl">Manage categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tags className="size-4" />
              Live category CRUD
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminCategories}>Open categories</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Artworks</CardDescription>
            <CardTitle className="text-xl">Manage artworks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Images className="size-4" />
              Images stored as VARBINARY
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminArtworks}>Open artworks</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Exhibitions</CardDescription>
            <CardTitle className="text-xl">Manage exhibitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              Schedule + artwork assignment
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminExhibitions}>Open exhibitions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Artists</CardDescription>
            <CardTitle className="text-xl">Manage artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              Live artist accounts
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminArtists}>Open accounts</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminArtistProfiles}>Open profiles</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitors</CardDescription>
            <CardTitle className="text-xl">Manage visitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" />
              Live visitor accounts
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminVisitors}>Open visitors grid</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inquiries</CardDescription>
            <CardTitle className="text-xl">Manage inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="size-4" />
              Contact form inbox
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminInquiries}>Open inquiries</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>COD Orders</CardDescription>
            <CardTitle className="text-xl">Manage orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="size-4" />
              Cash on Delivery only
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminOrders}>Open orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reports</CardDescription>
            <CardTitle className="text-xl">Gallery reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="size-4" />
              Live module counts
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.adminReports}>Open reports</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
