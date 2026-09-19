import { Link } from "react-router-dom";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandscapeDialogShell } from "@/components/common/LandscapeDialogShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SafeImage } from "@/components/common/SafeImage";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/features/explore/services/exploreService";
import type { GalleryArtwork } from "@/features/explore/types/galleryArtwork";
import {
  codOrderSchema,
  type CodOrderFormValues,
} from "@/features/orders/schemas/codOrderSchema";
import { orderService } from "@/features/orders/services/orderService";
import { useAuth } from "@/hooks/useAuth";
import { isVisitorRole } from "@/utils/roleRedirect";
import { getErrorMessage } from "@/utils/error";

interface CodPurchaseDialogProps {
  open: boolean;
  artwork: GalleryArtwork;
  onClose: () => void;
}

export function CodPurchaseDialog({
  open,
  artwork,
  onClose,
}: CodPurchaseDialogProps) {
  const titleId = useId();
  const { currentUser } = useAuth();
  const isVisitor = isVisitorRole(currentUser?.role);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CodOrderFormValues>({
    resolver: zodResolver(codOrderSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      deliveryAddress: "",
      notes: "",
      paymentMethod: "COD",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    reset({
      customerName: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      phone: "",
      deliveryAddress: "",
      notes: "",
      paymentMethod: "COD",
    });
  }, [open, artwork, currentUser, reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isSubmitting, onClose]);

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      await orderService.create({
        artworkTitle: artwork.title,
        artistName: artwork.artistName,
        price: artwork.price,
        customerName: values.customerName,
        // Keep account email so My Orders can match this purchase.
        email: currentUser?.email?.trim().toLowerCase() || values.email,
        phone: values.phone,
        deliveryAddress: values.deliveryAddress,
        notes: values.notes || null,
      });

      setSuccessMessage(
        "COD order placed. Pay cash when the artwork is delivered.",
      );
      reset({
        customerName: currentUser?.name ?? "",
        email: currentUser?.email ?? "",
        phone: "",
        deliveryAddress: "",
        notes: "",
        paymentMethod: "COD",
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <LandscapeDialogShell
      open={open}
      titleId={titleId}
      disabled={isSubmitting}
      onClose={onClose}
      aside={
        <>
          <SafeImage
            src={artwork.image}
            alt={artwork.title}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div className="mt-4 space-y-1">
            <h2 id={titleId} className="font-serif text-2xl font-semibold">
              {artwork.title}
            </h2>
            <p className="text-sm text-muted-foreground">{artwork.artistName}</p>
            <p className="text-lg font-medium">{formatPrice(artwork.price)}</p>
            <p className="pt-2 text-sm font-medium text-foreground">
              Payment: Cash on Delivery (COD)
            </p>
          </div>
        </>
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit} noValidate>
        <div>
          <h3 className="font-serif text-xl font-semibold sm:text-2xl">
            Delivery details
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Place a Cash on Delivery order — no online payment.
          </p>
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto md:pr-1">
          {successMessage ? (
            <Alert>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <AlertDescription>{successMessage}</AlertDescription>
              </div>
            </Alert>
          ) : null}

          {formError ? (
            <Alert variant="destructive">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <AlertDescription>{formError}</AlertDescription>
              </div>
            </Alert>
          ) : null}

          {!successMessage ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cod-name">Full name</Label>
                <Input
                  id="cod-name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.customerName)}
                  {...register("customerName")}
                />
                {errors.customerName ? (
                  <p className="text-sm text-destructive">
                    {errors.customerName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cod-email">Email</Label>
                <Input
                  id="cod-email"
                  type="email"
                  disabled={isSubmitting || Boolean(currentUser?.email)}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {currentUser?.email ? (
                  <p className="text-xs text-muted-foreground">
                    Linked to your account so the order appears under My orders.
                  </p>
                ) : null}
                {errors.email ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cod-phone">Phone</Label>
                <Input
                  id="cod-phone"
                  type="tel"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                {errors.phone ? (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cod-address">Delivery address</Label>
                <textarea
                  id="cod-address"
                  rows={2}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.deliveryAddress)}
                  className="flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("deliveryAddress")}
                />
                {errors.deliveryAddress ? (
                  <p className="text-sm text-destructive">
                    {errors.deliveryAddress.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cod-notes">Notes (optional)</Label>
                <Input
                  id="cod-notes"
                  disabled={isSubmitting}
                  placeholder="Landmark, preferred time, etc."
                  {...register("notes")}
                />
              </div>

              <input type="hidden" {...register("paymentMethod")} value="COD" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex shrink-0 flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            {successMessage ? "Close" : "Cancel"}
          </Button>
          {successMessage && isVisitor ? (
            <Button asChild>
              <Link to={ROUTES.visitorOrders} onClick={onClose}>
                View my orders
              </Link>
            </Button>
          ) : null}
          {!successMessage ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner
                    className="size-4 text-current"
                    label="Placing order"
                  />
                  Placing order...
                </span>
              ) : (
                "Place COD order"
              )}
            </Button>
          ) : null}
        </div>
      </form>
    </LandscapeDialogShell>
  );
}
