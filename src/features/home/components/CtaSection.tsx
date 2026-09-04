import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function CtaSection() {
  return (
    <section className="border-t border-border bg-card/60 py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">
          Discover Art That Inspires
        </h2>
        <p className="mt-3 text-muted-foreground">
          Visit the collection and find a work that speaks to you. Create an
          account when you want to purchase.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to={ROUTES.explore}>Explore Artworks</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={ROUTES.signup}>Sign up to purchase</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
