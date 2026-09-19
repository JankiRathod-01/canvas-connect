import { Link } from "react-router-dom";
import {
  CalendarDays,
  Compass,
  MessageSquare,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function VisitorHomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:py-16">
      <section className="rounded-xl border border-border bg-card p-8 shadow-sm sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Visitor home
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          You are signed in to {APP_NAME}. Browse artworks, track your COD
          orders, check exhibitions, or contact the gallery.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to={ROUTES.visitorOrders}>
              <Package className="size-4" />
              My orders
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.explore}>
              <Compass className="size-4" />
              Explore artworks
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.exhibitions}>
              <CalendarDays className="size-4" />
              View exhibitions
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.contact}>
              <MessageSquare className="size-4" />
              Contact gallery
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Orders</CardDescription>
            <CardTitle className="text-xl">My orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Package className="size-4" />
              Details and delivery status
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.visitorOrders}>Open orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Browse</CardDescription>
            <CardTitle className="text-xl">Explore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Compass className="size-4" />
              Search and filter live artworks
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.explore}>Open Explore</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visit</CardDescription>
            <CardTitle className="text-xl">Exhibitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              Dates, venue, and directions
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.exhibitions}>See shows</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Purchase</CardDescription>
            <CardTitle className="text-xl">Cash on Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <ShoppingBag className="size-4" />
              Order from Explore — no online payment
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.explore}>Browse to buy</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Questions</CardDescription>
            <CardTitle className="text-xl">Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Ask about availability or visits
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.contact}>Send inquiry</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
