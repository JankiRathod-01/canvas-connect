import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SafeImage } from "@/components/common/SafeImage";
import { ROUTES } from "@/constants/routes";
import {
  formatPrice,
  type GalleryArtwork,
} from "@/features/explore/data/galleryArtworks";
import { useAuth } from "@/hooks/useAuth";

interface ArtworkCardProps {
  artwork: GalleryArtwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const { isAuthenticated } = useAuth();
  const [purchaseNote, setPurchaseNote] = useState<string | null>(null);

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      return;
    }

    setPurchaseNote(
      "Checkout will be available after backend integration. Your account is ready for purchase once the API is connected.",
    );
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <SafeImage
        src={artwork.image}
        alt={artwork.title}
        className="aspect-[4/5] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
      <CardHeader className="space-y-1 p-4 pb-2">
        <CardTitle className="text-xl">{artwork.title}</CardTitle>
        <CardDescription>{artwork.artistName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="uppercase tracking-wide text-muted-foreground">
            {artwork.category}
          </span>
          <span className="font-medium">{formatPrice(artwork.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{artwork.description}</p>

        {purchaseNote ? (
          <Alert>
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <AlertDescription>{purchaseNote}</AlertDescription>
            </div>
          </Alert>
        ) : null}

        {isAuthenticated ? (
          <Button type="button" className="w-full" onClick={handlePurchaseClick}>
            <ShoppingBag className="size-4" />
            Purchase
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link to={ROUTES.signup}>
              <ShoppingBag className="size-4" />
              Sign up to purchase
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
