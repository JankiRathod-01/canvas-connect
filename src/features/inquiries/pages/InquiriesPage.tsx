import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useInquiries } from "@/features/inquiries/hooks/useInquiries";
import { inquiryService } from "@/features/inquiries/services/inquiryService";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUSES,
  type Inquiry,
  type InquiryStatusValue,
} from "@/features/inquiries/types/inquiry";
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

export function InquiriesPage() {
  const {
    items,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refresh,
  } = useInquiries();

  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (
    inquiry: Inquiry,
    status: InquiryStatusValue,
  ) => {
    setIsUpdating(true);
    setActionError(null);

    try {
      const updated = await inquiryService.updateStatus(inquiry.inquiryId, status);
      if (selected?.inquiryId === inquiry.inquiryId) {
        setSelected(updated);
      }
      refresh();
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
      await inquiryService.remove(deleteTarget.inquiryId);
      if (selected?.inquiryId === deleteTarget.inquiryId) {
        setSelected(null);
      }
      setDeleteTarget(null);
      refresh();
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inquiry management"
        title="Inquiries"
        description="Review visitor messages submitted from the Contact page."
      />

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search inquiries..."
          className="max-w-sm"
          aria-label="Search inquiries"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
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
            <Button type="button" size="sm" variant="outline" onClick={refresh}>
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
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <LoadingSpinner label="Loading inquiries" />
                      Loading inquiries...
                    </span>
                  </td>
                </tr>
              ) : null}

              {!isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No inquiries yet. Messages from `/contact` will appear here.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? items.map((inquiry) => (
                    <tr
                      key={inquiry.inquiryId}
                      className={`cursor-pointer border-b border-border last:border-0 hover:bg-muted/30 ${
                        selected?.inquiryId === inquiry.inquiryId
                          ? "bg-primary/5"
                          : ""
                      }`}
                      onClick={() => setSelected(inquiry)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {inquiry.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {inquiry.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {inquiry.subject}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {INQUIRY_STATUS_LABELS[inquiry.status]}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDateTime(inquiry.createdAt)}
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
                  Inquiry detail
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold">
                  {selected.subject}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.name} · {selected.email}
                  {selected.phone ? ` · ${selected.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(selected.createdAt)}
                </p>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {selected.message}
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="inquiry-status">
                  Status
                </label>
                <select
                  id="inquiry-status"
                  value={selected.status}
                  disabled={isUpdating}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  onChange={(event) => {
                    void handleStatusChange(
                      selected,
                      Number(event.target.value) as InquiryStatusValue,
                    );
                  }}
                >
                  {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.status === INQUIRY_STATUSES.new ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => {
                      void handleStatusChange(selected, INQUIRY_STATUSES.read);
                    }}
                  >
                    Mark as read
                  </Button>
                ) : null}
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
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an inquiry from the list to view the full message and update
              its status.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete inquiry?"
        description={
          deleteTarget
            ? `Delete the inquiry from “${deleteTarget.name}”? This cannot be undone.`
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
