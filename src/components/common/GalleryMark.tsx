import { cn } from "@/utils/cn";

interface GalleryMarkProps {
  className?: string;
  /** Accessible label when the mark is used alone. */
  alt?: string;
}

export function GalleryMark({
  className,
  alt = "Art Gallery logo",
}: GalleryMarkProps) {
  return (
    <img
      src="/images/logo.png"
      alt={alt}
      className={cn("size-9 object-contain", className)}
    />
  );
}
