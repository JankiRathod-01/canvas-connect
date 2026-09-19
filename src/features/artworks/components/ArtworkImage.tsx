import { useEffect, useState } from "react";
import { artworkService } from "@/features/artworks/services/artworkService";

interface ArtworkImageProps {
  artworkId: string;
  alt: string;
  className?: string;
}

export function ArtworkImage({ artworkId, alt, className }: ArtworkImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void (async () => {
      try {
        objectUrl = await artworkService.getImageObjectUrl(artworkId);
        if (!cancelled) {
          setSrc(objectUrl);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          setSrc(null);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [artworkId]);

  if (failed || !src) {
    return (
      <div
        className={
          className ??
          "flex size-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
        }
      >
        {failed ? "No image" : "..."}
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
