import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import type { ButtonVariantProps } from "@/components/ui/button-variants";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  size?: ButtonVariantProps["size"];
  variant?: ButtonVariantProps["variant"];
  /** When false, only the icon is shown on small screens. */
  alwaysShowLabel?: boolean;
  className?: string;
}

export function LogoutButton({
  size = "default",
  variant = "outline",
  alwaysShowLabel = true,
  className,
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmLogout = async () => {
    navigate(ROUTES.root);
    await logout();
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        disabled={isLoggingOut}
        onClick={() => setIsConfirmOpen(true)}
      >
        {isLoggingOut ? (
          <LoadingSpinner className="size-4" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span className={alwaysShowLabel ? undefined : "hidden sm:inline"}>
          Logout
        </span>
      </Button>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Log out?"
        description="You will need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        isConfirming={isLoggingOut}
        onCancel={() => {
          if (!isLoggingOut) {
            setIsConfirmOpen(false);
          }
        }}
        onConfirm={() => {
          void handleConfirmLogout();
        }}
      />
    </>
  );
}
