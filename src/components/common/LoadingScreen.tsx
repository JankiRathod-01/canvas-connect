import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background">
      <LoadingSpinner className="size-7" label={message} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
