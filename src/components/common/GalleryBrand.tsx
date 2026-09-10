import { Link } from "react-router-dom";
import { GalleryMark } from "@/components/common/GalleryMark";
import { cn } from "@/utils/cn";

interface GalleryBrandProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  markClassName?: string;
  titleClassName?: string;
  subtitle?: string;
}

export function GalleryBrand({
  to = "/",
  onClick,
  className,
  markClassName,
  titleClassName,
  subtitle,
}: GalleryBrandProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex min-w-0 items-center gap-3 text-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span className="shrink-0 overflow-hidden rounded-full shadow-[0_1px_2px_rgba(60,40,20,0.12)] ring-1 ring-border/70">
        <GalleryMark className={cn("size-10", markClassName)} />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-serif text-xl font-semibold tracking-tight sm:text-2xl",
            titleClassName,
          )}
        >
          Art Gallery
        </span>
        {subtitle ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
