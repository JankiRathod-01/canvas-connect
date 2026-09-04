import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t border-border bg-card/60 py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">
          Discover Art That Inspires
        </h2>
        <p className="mt-3 text-muted-foreground">
          Visit the collection and find a work that speaks to you.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/#featured">Explore Artworks</Link>
        </Button>
      </div>
    </section>
  );
}
