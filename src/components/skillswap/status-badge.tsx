import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/skillswap/api";

const styles: Record<BookingStatus, string> = {
  pending: "bg-warning-soft text-warning-foreground",
  accepted: "bg-success-soft text-success",
  declined: "bg-danger-soft text-destructive",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

export function StatusBadge({
  status,
  conflict = false,
  className,
}: {
  status: BookingStatus;
  conflict?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {labels[status]}
      {conflict && " • Conflict flagged"}
    </span>
  );
}
