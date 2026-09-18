import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Package, Play } from "lucide-react";
import { formatRate, serviceQuery } from "@/lib/skillswap/api";
import { thumbnailFor } from "@/lib/skillswap/categories";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(serviceQuery(params.serviceId)),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — SkillSwap` : "Service — SkillSwap" },
      {
        name: "description",
        content: loaderData?.description.slice(0, 150) ?? "Educational content service on SkillSwap.",
      },
      { property: "og:title", content: loaderData?.title ?? "SkillSwap service" },
      {
        property: "og:description",
        content: loaderData?.description.slice(0, 150) ?? "Educational content service on SkillSwap.",
      },
    ],
  }),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(serviceId));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to Explore
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="group relative overflow-hidden rounded-3xl border shadow-card">
            <img
              src={thumbnailFor(service.category)}
              alt={service.category}
              width={1024}
              height={640}
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-card/90 shadow-card backdrop-blur">
                <Play className="ml-1 size-7 fill-primary text-primary" />
              </span>
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-accent-foreground backdrop-blur">
              {service.category}
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-extrabold leading-tight sm:text-4xl">{service.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              {service.creator.name.charAt(0)}
            </span>
            <div>
              <p className="font-semibold">{service.creator.name}</p>
              <p className="text-sm text-muted-foreground">{service.creator.tagline}</p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-bold">About this service</h2>
            <p className="leading-relaxed text-muted-foreground">{service.description}</p>
          </section>

          {service.deliverables && (
            <section className="mt-8">
              <h2 className="mb-2 text-lg font-bold">What you'll receive</h2>
              <p className="leading-relaxed text-muted-foreground">{service.deliverables}</p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border bg-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground">Rate</p>
            <p className="mt-1 text-3xl font-extrabold">{formatRate(service.rate, service.rate_unit)}</p>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-primary" />
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="ml-auto font-semibold">{service.delivery_days} days</dd>
              </div>
              <div className="flex items-center gap-3">
                <Package className="size-4 text-primary" />
                <dt className="text-muted-foreground">Category</dt>
                <dd className="ml-auto font-semibold">{service.category}</dd>
              </div>
            </dl>

            <Button asChild variant="brand" size="xl" className="mt-6 w-full">
              <Link to="/book/$serviceId" params={{ serviceId: service.id }}>
                Book This Service
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No payment needed — the creator confirms your request first.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
