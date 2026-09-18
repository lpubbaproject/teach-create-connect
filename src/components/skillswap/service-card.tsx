import { Link } from "@tanstack/react-router";
import { thumbnailFor } from "@/lib/skillswap/categories";
import { formatRate, type Service } from "@/lib/skillswap/api";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$serviceId"
      params={{ serviceId: service.id }}
      className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={thumbnailFor(service.category)}
          alt={service.category}
          width={1024}
          height={640}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-accent-foreground backdrop-blur">
          {service.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug">{service.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
              {service.creator.name.charAt(0)}
            </span>
            {service.creator.name}
          </span>
          <span className="font-bold text-foreground">
            {formatRate(service.rate, service.rate_unit)}
          </span>
        </div>
      </div>
    </Link>
  );
}
