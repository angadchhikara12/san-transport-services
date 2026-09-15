import { mutation } from "./_generated/server";
import { v } from "convex/values";

function generateBookingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function parsePassengerCount(val: string): number {
  const num = parseInt(val);
  return isNaN(num) ? 1 : num;
}

function parseLuggageCount(val: string): number {
  if (!val || val === "No Luggage") return 0;
  const match = val.match(/(\d+)/);
  if (!match) return 0;
  return parseInt(match[1]);
}

export const create = mutation({
  args: {
    service_type: v.string(),
    pickup_date: v.string(),
    pickup_time: v.string(),
    pickup_location: v.string(),
    dropoff_location: v.string(),
    passengers: v.string(),
    luggage: v.string(),
    special_requests: v.string(),
    vehicle: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.string(),
    price_quote: v.optional(v.number()),
    helcim_transaction_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking_code = generateBookingCode();
    await ctx.db.insert("bookings", {
      booking_code,
      service_type: args.service_type,
      pickup_date: args.pickup_date || undefined,
      pickup_time: args.pickup_time || undefined,
      pickup_location: args.pickup_location,
      dropoff_location: args.dropoff_location || undefined,
      passengers: parsePassengerCount(args.passengers),
      luggage_count: parseLuggageCount(args.luggage),
      special_request: args.special_requests || undefined,
      vehicle: args.vehicle || undefined,
      first_name: args.first_name,
      last_name: args.last_name || undefined,
      email: args.email,
      phone_number: args.phone || undefined,
      company_name: args.company || undefined,
      status: "pending",
      payment_status: args.helcim_transaction_id ? "paid" : "unpaid",
      price_quote: args.price_quote ?? 0,
      helcim_transaction_id: args.helcim_transaction_id || undefined,
    });
    return { booking_code };
  },
});