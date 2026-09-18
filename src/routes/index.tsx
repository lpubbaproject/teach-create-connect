import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { z } from "zod";
import { servicesQuery } from "@/lib/skillswap/api";
import { CATEGORIES } from "@/lib/skillswap/categories";
import { ServiceCard } from "@/components/skillswap/service-card";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: () => ({
    meta: [
      { title: "SkillSwap — Turn knowledge into content people understand" },
      {
        name: "description",
        content:
          "Find creators who can transform your lessons, ideas and teaching material into engaging learning content.",
      },
      { property: "og:title", content: "SkillSwap — Educational creator marketplace" },
      {
        property: "og:description",
        content: "Book creators who turn lessons into videos, explainers, infographics and more.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { q = "", category } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const query = q.trim().toLowerCase();
  const filtered = services.filter((s) => {
    const matchesCategory = !category || s.category === category;
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.creator.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const setSearch = (patch: { q?: string; category?: string }) =>
    navigate({
      search: (prev) => ({
        q: patch.q !== undefined ? patch.q || undefined : prev.q,
        category: patch.category !== undefined ? patch.category || undefined : prev.category,
      }),
      replace: true,
    });

  return (
    <div className="bg-gradient-hero">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">
          Educational creator marketplace
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl">
          Turn knowledge into <span className="text-gradient-brand">content people understand.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Find creators who can transform your lessons, ideas and teaching material into engaging
          learning content.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-full border bg-card p-2 pl-5 shadow-card">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setSearch({ q: e.target.value })}
            placeholder="Search services, topics or creators…"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search services"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <CategoryChip active={!category} onClick={() => setSearch({ category: "" })}>
            All
          </CategoryChip>
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => setSearch({ category: category === c ? "" : c })}
            >
              {c}
            </CategoryChip>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">{category ?? "All services"}</h2>
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "service" : "services"}
          </span>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/60 p-12 text-center text-muted-foreground">
            No services match your search yet. Try another keyword or category.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
