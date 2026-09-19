import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/features/explore/services/exploreService";
import { orderService } from "@/features/orders/services/orderService";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type Order,
  type OrderStatusValue,
} from "@/features/orders/types/order";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
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

const statusTone: Record<OrderStatusValue, string> = {
  [ORDER_STATUSES.pending]: "bg-amber-500/15 text-amber-900",
  [ORDER_STATUSES.confirmed]: "bg-sky-500/15 text-sky-900",
  [ORDER_STATUSES.outForDelivery]: "bg-violet-500/15 text-violet-900",
  [ORDER_STATUSES.delivered]: "bg-emerald-500/15 text-emerald-900",
  [ORDER_STATUSES.cancelled]: "bg-muted text-muted-foreground",
};

export function MyOrdersPage() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orders = await orderService.getMine();
      setItems(orders);
      setSelected((current) => {
        if (!current) {
          return orders[0] ?? null;
        }
        return orders.find((order) => order.orderId === current.orderId) ?? orders[0] ?? null;
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setItems([]);
      setSelected(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            My account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            My orders
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            COD orders placed with the email{" "}
            <span className="font-medium text-foreground">
              {currentUser?.email ?? "your account"}
            </span>
            . Track status and delivery details here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void load()}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.explore}>Continue shopping</Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.visitor}>Visitor home</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => void load()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner label="Loading orders" />
            Loading your orders...
          </span>
        </div>
      ) : null}

      {!isLoading && items.length === 0 && !error ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Package className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Place a Cash on Delivery order from Explore. Use the same email as
            this account so it appears here.
          </p>
          <Button asChild className="mt-6">
            <Link to={ROUTES.explore}>Browse Explore</Link>
          </Button>
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Artwork</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Placed</th>
                </tr>
              </thead>
              <tbody>
                {items.map((order) => (
                  <tr
                    key={order.orderId}
                    className={cn(
                      "cursor-pointer border-b border-border last:border-0 hover:bg-muted/30",
                      selected?.orderId === order.orderId && "bg-primary/5",
                    )}
                    onClick={() => setSelected(order)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.artworkTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.artistName}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {formatPrice(order.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          statusTone[order.status],
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="rounded-xl border border-border bg-card p-5 sm:p-6">
            {selected ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Order detail
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">
                    {selected.artworkTitle}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.artistName} · {formatPrice(selected.price)} ·{" "}
                    {selected.paymentMethod}
                  </p>
                  <span
                    className={cn(
                      "mt-3 inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                      statusTone[selected.status],
                    )}
                  >
                    {ORDER_STATUS_LABELS[selected.status]}
                  </span>
                </div>

                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Order id</dt>
                    <dd className="mt-0.5 break-all font-mono text-xs">
                      {selected.orderId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Placed on</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatDateTime(selected.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Customer name</dt>
                    <dd className="mt-0.5 font-medium">{selected.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="mt-0.5 font-medium">{selected.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="mt-0.5 font-medium">{selected.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Delivery address</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap font-medium">
                      {selected.deliveryAddress}
                    </dd>
                  </div>
                  {selected.notes ? (
                    <div>
                      <dt className="text-muted-foreground">Notes</dt>
                      <dd className="mt-0.5 font-medium">{selected.notes}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="text-xs text-muted-foreground">
                  Status is updated by the gallery team. Pay cash when the
                  artwork is delivered.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an order to view full details.
              </p>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
