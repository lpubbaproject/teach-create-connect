import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  bookingsQuery,
  formatDate,
  isConflicting,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/skillswap/api";
import { StatusBadge } from "@/components/skillswap/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(bookingsQuery),
  head: () => ({
    meta: [
      { title: "Creator Dashboard — SkillSwap" },
      { name: "description", content: "Review, accept or decline incoming booking requests." },
      { property: "og:title", content: "Creator Dashboard — SkillSwap" },
      { property: "og:description", content: "Manage booking requests for your services." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: bookings } = useSuspenseQuery(bookingsQuery);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success(status === "accepted" ? "Booking accepted" : "Booking declined");
    },
    onError: () => toast.error("Could not update the booking."),
  });

  const pending = bookings.filter((b) => b.status === "pending");
  const accepted = bookings.filter((b) => b.status === "accepted");
  const declined = bookings.filter((b) => b.status === "declined");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Creator Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Incoming requests for your services.</p>

      <Section title="Pending Requests" count={pending.length} empty="No pending requests right now.">
        {pending.map((b) => {
          const conflict = isConflicting(b, bookings);
          return (
            <RequestCard key={b.id} booking={b} conflict={conflict}>
              {conflict && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-warning-foreground">
                  <AlertTriangle className="size-3.5" /> This date conflicts with an accepted booking.
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  disabled={conflict || mutation.isPending}
                  onClick={() => mutation.mutate({ id: b.id, status: "accepted" })}
                >
                  <Check /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ id: b.id, status: "declined" })}
                >
                  <X /> Decline
                </Button>
              </div>
            </RequestCard>
          );
        })}
      </Section>

      <Section title="Accepted Bookings" count={accepted.length} empty="Nothing accepted yet.">
        {accepted.map((b) => (
          <RequestCard key={b.id} booking={b} />
        ))}
      </Section>

      <Section title="Declined Bookings" count={declined.length} empty="Nothing declined.">
        {declined.map((b) => (
          <RequestCard key={b.id} booking={b} />
        ))}
      </Section>
    </div>
  );
}

function Section({
  title,
  count,
  empty,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="rounded-2xl border border-dashed bg-card/60 p-8 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="grid gap-3">{children}</div>
      )}
    </section>
  );
}

function RequestCard({
  booking,
  conflict = false,
  children,
}: {
  booking: Booking;
  conflict?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status as BookingStatus} conflict={conflict} />
            <span className="text-xs text-muted-foreground">{booking.service.creator.name}</span>
          </div>
          <h3 className="mt-2 font-bold leading-snug">{booking.service.title}</h3>
          <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Client</dt>
              <dd className="font-medium">{booking.client_name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Requested date</dt>
              <dd className="font-medium">{formatDate(booking.requested_date)}</dd>
            </div>
          </dl>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{booking.needs}</p>
        </div>
        {children && <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">{children}</div>}
      </div>
    </article>
  );
}
