import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { bookingsQuery, formatDate, isConflicting, type BookingStatus } from "@/lib/skillswap/api";
import { thumbnailFor } from "@/lib/skillswap/categories";
import { StatusBadge } from "@/components/skillswap/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export const Route = createFileRoute("/bookings")({
  validateSearch: z.object({
    status: z.enum(["all", "pending", "accepted", "declined"]).optional(),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bookingsQuery),
  head: () => ({
    meta: [
      { title: "My Bookings — SkillSwap" },
      { name: "description", content: "Track your pending, accepted and declined booking requests." },
      { property: "og:title", content: "My Bookings — SkillSwap" },
      { property: "og:description", content: "Track your booking requests with SkillSwap creators." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { data: bookings } = useSuspenseQuery(bookingsQuery);
  const { status = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/bookings" });

  const visible = status === "all" ? bookings : bookings.filter((b) => b.status === status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">My Bookings</h1>
      <p className="mt-2 text-muted-foreground">Everything you've requested from creators, in one place.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() =>
              navigate({ search: { status: t.value === "all" ? undefined : t.value }, replace: true })
            }
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              status === t.value
                ? "border-transparent bg-foreground text-background"
                : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="ml-1.5 opacity-60">
              {t.value === "all" ? bookings.length : bookings.filter((b) => b.status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card/60 p-12 text-center text-muted-foreground">
            No {status === "all" ? "" : status} bookings yet.{" "}
            <Link to="/" className="font-semibold text-primary">
              Explore services
            </Link>
          </div>
        )}
        {visible.map((b) => (
          <article
            key={b.id}
            className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-card sm:flex-row sm:items-center"
          >
            <img
              src={thumbnailFor(b.service.category)}
              alt={b.service.category}
              width={1024}
              height={640}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-xl object-cover sm:w-40"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={b.status as BookingStatus} conflict={isConflicting(b, bookings)} />
                <span className="text-xs text-muted-foreground">{b.service.category}</span>
              </div>
              <Link
                to="/services/$serviceId"
                params={{ serviceId: b.service_id }}
                className="mt-2 block font-bold leading-snug hover:text-primary"
              >
                {b.service.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {b.service.creator.name} · Requested for {formatDate(b.requested_date)}
              </p>
              {b.status === "declined" && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-danger-soft/60 p-3">
                  <p className="text-sm font-medium text-destructive">Booking declined</p>
                  <Button asChild size="sm" variant="outline" className="ml-auto">
                    <Link to="/" search={{ category: b.service.category }}>
                      Find Similar Services
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
