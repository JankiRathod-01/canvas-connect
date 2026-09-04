import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Art Gallery
        </p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome to Our Art Gallery
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          Explore creativity, imagination and artistic expression.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link to="/#featured">Explore Gallery</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=1200&q=80"
          alt="Artwork displayed in a quiet gallery hall"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
      </div>
    </section>
  );
}
