import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createBooking, formatDate, formatRate, serviceQuery, type Booking } from "@/lib/skillswap/api";
import { thumbnailFor } from "@/lib/skillswap/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/book/$serviceId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(serviceQuery(params.serviceId)),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Book: ${loaderData.title} — SkillSwap` : "Book a service — SkillSwap" },
      { name: "description", content: "Send a booking request to a SkillSwap creator." },
      { property: "og:title", content: "Book a service — SkillSwap" },
      { property: "og:description", content: "Send a booking request to a SkillSwap creator." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { serviceId } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(serviceId));
  const queryClient = useQueryClient();
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [form, setForm] = useState({ client_name: "", requested_date: "", needs: "", message: "" });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setConfirmed(booking);
      toast.success("Booking request sent");
    },
    onError: () => toast.error("Could not create the booking. Please try again."),
  });

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-9 text-success" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold">Booking confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Your request for <strong className="text-foreground">{service.title}</strong> has been sent
          to {service.creator.name} for {formatDate(confirmed.requested_date)}. It's now pending their
          approval.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="brand" size="lg">
            <Link to="/bookings">View My Bookings</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      service_id: service.id,
      client_name: form.client_name.trim(),
      requested_date: form.requested_date,
      needs: form.needs.trim(),
      message: form.message.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/services/$serviceId"
        params={{ serviceId }}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to service
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Book this service</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell the creator what you need. They'll accept or decline your request.
          </p>

          <div className="mt-8 grid gap-5">
            <Field label="Your name" htmlFor="client_name">
              <Input
                id="client_name"
                required
                placeholder="e.g. Riverside High School"
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              />
            </Field>
            <Field label="Requested date" htmlFor="requested_date">
              <Input
                id="requested_date"
                type="date"
                required
                value={form.requested_date}
                onChange={(e) => setForm({ ...form, requested_date: e.target.value })}
              />
            </Field>
            <Field label="What do you need?" htmlFor="needs">
              <Textarea
                id="needs"
                required
                rows={3}
                placeholder="Describe the lesson, topic or material you'd like turned into content."
                value={form.needs}
                onChange={(e) => setForm({ ...form, needs: e.target.value })}
              />
            </Field>
            <Field label="Additional message (optional)" htmlFor="message">
              <Textarea
                id="message"
                rows={3}
                placeholder="Style preferences, brand colours, audience details…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
          </div>

          <Button
            type="submit"
            variant="brand"
            size="xl"
            className="mt-8 w-full sm:w-auto"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending…" : "Confirm Booking"}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
            <img
              src={thumbnailFor(service.category)}
              alt={service.category}
              width={1024}
              height={640}
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {service.category}
              </p>
              <h2 className="mt-1 font-bold leading-snug">{service.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">by {service.creator.name}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-lg font-extrabold">
                  {formatRate(service.rate, service.rate_unit)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
