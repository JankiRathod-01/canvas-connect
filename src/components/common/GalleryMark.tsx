import { cn } from "@/utils/cn";

interface GalleryMarkProps {
  className?: string;
}

export function GalleryMark({ className }: GalleryMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={cn("size-5 text-primary", className)}
      fill="none"
    >
      <rect
        x="6"
        y="8"
        width="20"
        height="16"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 20.5 14 14.5l3.4 4 2.3-2.8 3.8 4.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
