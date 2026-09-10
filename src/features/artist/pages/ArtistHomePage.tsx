import { Link } from "react-router-dom";
import { ImagePlus, Package, Palette } from "lucide-react";
import { SafeImage } from "@/components/common/SafeImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import {
  formatPrice,
  getArtworksByArtistId,
} from "@/features/explore/data/galleryArtworks";
import { useAuth } from "@/hooks/useAuth";

export function ArtistHomePage() {
  const { currentUser } = useAuth();
  const myArtworks = currentUser
    ? getArtworksByArtistId(currentUser.id)
    : [];

  const totalValue = myArtworks.reduce(
    (sum, artwork) => sum + artwork.price,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Artist studio
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome, {currentUser?.name ?? "Artist"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This is your artist landing page. Upload tools and sales reports will
          be added in later modules. Below is your current demo collection.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>My artworks</CardDescription>
            <CardTitle className="text-3xl">{myArtworks.length}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette className="size-4" />
            Uploaded products
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collection value</CardDescription>
            <CardTitle className="text-3xl">{formatPrice(totalValue)}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="size-4" />
            Listed price total
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next step</CardDescription>
            <CardTitle className="text-xl">Upload artwork</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="size-4" />
            Coming after API integration
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              My uploaded products
            </h2>
            <p className="text-sm text-muted-foreground">
              Static demo data linked to your artist account.
            </p>
          </div>
          <Link
            to={ROUTES.explore}
            className="text-sm font-medium text-primary hover:underline"
          >
            View public gallery
          </Link>
        </div>

        {myArtworks.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No artworks found for this artist yet.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myArtworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden shadow-sm">
                <SafeImage
                  src={artwork.image}
                  alt={artwork.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-lg">{artwork.title}</CardTitle>
                  <CardDescription>{artwork.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-sm font-medium">
                  {formatPrice(artwork.price)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
