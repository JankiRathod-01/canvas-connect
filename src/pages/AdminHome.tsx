import { Link } from "react-router-dom";
import { Images, Users, ShieldCheck, MessageSquare } from "lucide-react";
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
import { galleryArtworks } from "@/features/explore/data/galleryArtworks";
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
            <CardDescription>Artworks</CardDescription>
            <CardTitle className="text-3xl">{galleryArtworks.length}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Images className="size-4" />
            Demo collection
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
              <Link to={ROUTES.adminArtists}>Open artists grid</Link>
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
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="size-4" />
            Module coming soon
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
