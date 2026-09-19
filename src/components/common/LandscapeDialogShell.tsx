import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface LandscapeDialogShellProps {
  open: boolean;
  titleId: string;
  disabled?: boolean;
  onClose: () => void;
  /** Left panel — summary, preview, or secondary content */
  aside: ReactNode;
  /** Right panel — main form content */
  children: ReactNode;
  /** Wider dialog for dense forms (exhibitions). Default max-w-4xl. */
  wide?: boolean;
}

/**
 * Shared landscape modal shell: portal + backdrop + two-column card.
 * Mobile stacks aside above content.
 */
export function LandscapeDialogShell({
  open,
  titleId,
  disabled = false,
  onClose,
  aside,
  children,
  wide = false,
}: LandscapeDialogShellProps) {
  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40"
        aria-label="Close dialog"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onClose();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 grid max-h-[min(90vh,680px)] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg md:grid-cols-[0.95fr_1.05fr] ${
          wide ? "max-w-5xl" : "max-w-4xl"
        }`}
      >
        <aside className="flex min-h-0 flex-col border-b border-border bg-muted/30 p-5 md:border-b-0 md:border-r md:p-6">
          {aside}
        </aside>
        <div className="flex min-h-0 flex-col overflow-hidden p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
