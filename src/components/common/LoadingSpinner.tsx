import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  className,
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <LoaderCircle
      aria-label={label}
      className={cn("size-5 animate-spin text-primary", className)}
    />
  );
}
