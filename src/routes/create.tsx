import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createService } from "@/lib/skillswap/api";
import { CATEGORIES } from "@/lib/skillswap/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Service — SkillSwap" },
      { name: "description", content: "Publish a new educational content service to the marketplace." },
      { property: "og:title", content: "Create a Service — SkillSwap" },
      { property: "og:description", content: "Offer your skills to educators on SkillSwap." },
    ],
  }),
  component: CreateServicePage,
});

function CreateServicePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    creator_name: "",
    title: "",
    category: "",
    rate: "",
    description: "",
    deliverables: "",
  });

  const mutation = useMutation({
    mutationFn: createService,
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service published!");
      navigate({ to: "/services/$serviceId", params: { serviceId: service.id } });
    },
    onError: () => toast.error("Could not publish the service. Please try again."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please choose a category.");
      return;
    }
    mutation.mutate({
      creator_name: form.creator_name.trim(),
      title: form.title.trim(),
      category: form.category,
      rate: Number(form.rate),
      description: form.description.trim(),
      deliverables: form.deliverables.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Create a Service</h1>
      <p className="mt-2 text-muted-foreground">
        Describe what you can create for educators. It goes live on Explore right away.
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        <div className="grid gap-2">
          <Label htmlFor="creator_name">Your creator name</Label>
          <Input
            id="creator_name"
            required
            placeholder="e.g. Maya Chen"
            value={form.creator_name}
            onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Service title</Label>
          <Input
            id="title"
            required
            placeholder="e.g. Turn your lecture into a 10-minute video"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rate">Rate (USD per project)</Label>
            <Input
              id="rate"
              type="number"
              min={1}
              step={1}
              required
              placeholder="250"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            rows={4}
            placeholder="What do you create, for whom, and how does the process work?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deliverables">What will the client receive? (optional)</Label>
          <Textarea
            id="deliverables"
            rows={3}
            placeholder="e.g. Edited MP4 in 1080p, captions file, one revision round"
            value={form.deliverables}
            onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
          />
        </div>
        <Button type="submit" variant="brand" size="xl" className="mt-2" disabled={mutation.isPending}>
          {mutation.isPending ? "Publishing…" : "Publish Service"}
        </Button>
      </form>
    </div>
  );
}
