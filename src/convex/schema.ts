import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Fleet vehicles — mirrors what src/components/FleetSection.tsx,
  // FleetComparison.tsx, src/app/book/page.tsx and
  // src/app/fleet/[car]/page.tsx read.
  cars: defineTable({
    id: v.number(),
    name: v.string(),
    image: v.optional(v.string()),
    passenger_cap: v.number(),
    luggage_cap: v.number(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    isAvailable: v.boolean(),
    fuel_surcharge: v.optional(v.string()),
    vehicle_rate: v.optional(v.string()),
    vin_number: v.optional(v.string()),
    standard_gratuity: v.optional(v.string()),
  }).index("by_id_number", ["id"]),

  // Bookings — written by the POST /api/bookings route handler.
  bookings: defineTable({
    booking_code: v.string(),
    service_type: v.string(),
    pickup_date: v.optional(v.string()),
    pickup_time: v.optional(v.string()),
    pickup_location: v.string(),
    dropoff_location: v.optional(v.string()),
    passengers: v.number(),
    luggage_count: v.number(),
    special_request: v.optional(v.string()),
    vehicle: v.optional(v.string()),
    first_name: v.string(),
    last_name: v.optional(v.string()),
    email: v.string(),
    phone_number: v.optional(v.string()),
    company_name: v.optional(v.string()),
    status: v.string(),
    payment_status: v.string(),
    price_quote: v.number(),
    helcim_transaction_id: v.optional(v.string()),
  }).index("by_code", ["booking_code"]),

  // Contact submissions — written by the POST /api/contact route handler.
  contacts: defineTable({
    first_name: v.string(),
    last_name: v.optional(v.string()),
    email: v.string(),
    phone_number: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    status: v.string(),
  }),
});