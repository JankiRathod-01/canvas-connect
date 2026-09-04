import { Root } from "@radix-ui/react-label";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Label({ className, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
