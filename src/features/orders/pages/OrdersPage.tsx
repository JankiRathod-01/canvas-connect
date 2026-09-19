import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderService } from "@/features/orders/services/orderService";
import {
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatusValue,
} from "@/features/orders/types/order";
import { formatPrice } from "@/features/explore/data/galleryArtworks";
import { getErrorMessage } from "@/utils/error";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string, status: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const orders = await orderService.getAll({
        search: searchTerm,
        status: status === "all" ? undefined : Number(status),
      });
      setItems(orders);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void load(search, statusFilter);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [search, statusFilter, load]);

  const handleStatusChange = async (order: Order, status: OrderStatusValue) => {
    setIsUpdating(true);
    setActionError(null);

    try {
      const updated = await orderService.updateStatus(order.orderId, status);
      if (selected?.orderId === order.orderId) {
        setSelected(updated);
      }
      void load(search, statusFilter);
    } catch (updateError) {
      setActionError(getErrorMessage(updateError));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await orderService.remove(deleteTarget.orderId);
      if (selected?.orderId === deleteTarget.orderId) {
        setSelected(null);
      }
      setDeleteTarget(null);
      void load(search, statusFilter);
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Order management"
        title="COD Orders"
        description="Cash on Delivery orders from the Explore gallery. No online payment."
      />

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search orders..."
          className="max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="all">All statuses</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void load(search, statusFilter)}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Artwork</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner label="Loading orders" />
                      Loading orders...
                    </span>
                  </td>
                </tr>
              ) : null}

              {!isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No COD orders yet.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? items.map((order) => (
                    <tr
                      key={order.orderId}
                      className={`cursor-pointer border-b border-border last:border-0 hover:bg-muted/30 ${
                        selected?.orderId === order.orderId ? "bg-primary/5" : ""
                      }`}
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.artworkTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.artistName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatPrice(order.price)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {ORDER_STATUS_LABELS[order.status]}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border p-5">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  COD order detail
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">
                  {selected.artworkTitle}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.artistName} · {formatPrice(selected.price)} ·{" "}
                  {selected.paymentMethod}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(selected.createdAt)}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {selected.customerName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {selected.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {selected.phone}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {selected.deliveryAddress}
                </p>
                {selected.notes ? (
                  <p>
                    <span className="font-medium">Notes:</span> {selected.notes}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="order-status">
                  Status
                </label>
                <select
                  id="order-status"
                  value={selected.status}
                  disabled={isUpdating}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onChange={(event) => {
                    void handleStatusChange(
                      selected,
                      Number(event.target.value) as OrderStatusValue,
                    );
                  }}
                >
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setDeleteTarget(selected)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a COD order to view delivery details and update status.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete order?"
        description={
          deleteTarget
            ? `Delete the COD order for “${deleteTarget.artworkTitle}”?`
            : ""
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={() => {
          void handleDelete();
        }}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
