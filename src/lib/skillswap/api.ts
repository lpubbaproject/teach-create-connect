import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Creator = Tables<"creators">;
export type Service = Tables<"services"> & { creator: Creator };
export type BookingStatus = "pending" | "accepted" | "declined";
export type Booking = Tables<"bookings"> & { service: Service };

const SERVICE_SELECT = "*, creator:creators(*)";
const BOOKING_SELECT = "*, service:services(*, creator:creators(*))";

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Service[];
}

export async function fetchService(id: string): Promise<Service> {
  const { data, error } = await supabase.from("services").select(SERVICE_SELECT).eq("id", id).single();
  if (error) throw error;
  return data as Service;
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Booking[];
}

export const servicesQuery = queryOptions({ queryKey: ["services"], queryFn: fetchServices });
export const serviceQuery = (id: string) =>
  queryOptions({ queryKey: ["services", id], queryFn: () => fetchService(id) });
export const bookingsQuery = queryOptions({ queryKey: ["bookings"], queryFn: fetchBookings });

export async function createBooking(input: {
  service_id: string;
  client_name: string;
  requested_date: string;
  needs: string;
  message?: string | undefined;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...input, message: input.message ?? null, status: "pending" })
    .select(BOOKING_SELECT)
    .single();
  if (error) throw error;
  return data as Booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function createService(input: {
  creator_name: string;
  title: string;
  category: string;
  rate: number;
  description: string;
  deliverables?: string | undefined;
}) {
  // Reuse an existing creator with the same name, otherwise create one.
  const { data: existing } = await supabase
    .from("creators")
    .select("*")
    .ilike("name", input.creator_name)
    .maybeSingle();

  let creatorId = existing?.id;
  if (!creatorId) {
    const { data: created, error } = await supabase
      .from("creators")
      .insert({ name: input.creator_name, tagline: "New SkillSwap creator" })
      .select("*")
      .single();
    if (error) throw error;
    creatorId = created.id;
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      creator_id: creatorId,
      title: input.title,
      category: input.category,
      rate: input.rate,
      description: input.description,
      deliverables: input.deliverables || null,
    })
    .select(SERVICE_SELECT)
    .single();
  if (error) throw error;
  return data as Service;
}

/**
 * Double-booking rule: a pending request conflicts when the same creator
 * already has an accepted booking on the same requested date.
 */
export function isConflicting(booking: Booking, all: Booking[]): boolean {
  if (booking.status !== "pending") return false;
  return all.some(
    (b) =>
      b.id !== booking.id &&
      b.status === "accepted" &&
      b.requested_date === booking.requested_date &&
      b.service.creator_id === booking.service.creator_id,
  );
}

export function formatRate(rate: number | string, unit: string) {
  const n = typeof rate === "string" ? Number(rate) : rate;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${unit}`;
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
