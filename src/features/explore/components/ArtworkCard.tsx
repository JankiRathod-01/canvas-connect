import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ShoppingBag } from "lucide-react";
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
import { formatPrice } from "@/features/explore/services/exploreService";
import type { GalleryArtwork } from "@/features/explore/types/galleryArtwork";
import { CodPurchaseDialog } from "@/features/orders/components/CodPurchaseDialog";

interface ArtworkCardProps {
  artwork: GalleryArtwork;
}

function buildInquirePath(artwork: GalleryArtwork): string {
  const params = new URLSearchParams({
    subject: `Inquiry about “${artwork.title}”`,
    message: `Hello,\n\nI am interested in the artwork “${artwork.title}” by ${artwork.artistName} (${formatPrice(artwork.price)}).\n\nPlease share availability and next steps.\n`,
  });

  return `${ROUTES.contact}?${params.toString()}`;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [codOpen, setCodOpen] = useState(false);
  const inquirePath = buildInquirePath(artwork);

  return (
    <>
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

          <Button
            type="button"
            className="w-full"
            onClick={() => setCodOpen(true)}
          >
            <ShoppingBag className="size-4" />
            Buy with COD
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link to={inquirePath}>
              <MessageSquare className="size-4" />
              Inquire instead
            </Link>
          </Button>
        </CardContent>
      </Card>

      <CodPurchaseDialog
        open={codOpen}
        artwork={artwork}
        onClose={() => setCodOpen(false)}
      />
    </>
  );
}
