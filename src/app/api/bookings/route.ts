import { NextRequest, NextResponse } from "next/server"
import { fetchMutation } from "convex/nextjs"
import { api } from "convex/_generated/api"

interface BookingRequest {
  service_type: string
  pickup_date: string
  pickup_time: string
  pickup_location: string
  dropoff_location: string
  passengers: string
  luggage: string
  special_requests: string
  vehicle: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  price_quote?: number
  helcim_transaction_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    const result = await fetchMutation(api.bookings.create, body)
    return NextResponse.json({ booking: { booking_code: result.booking_code } }, { status: 201 })
  } catch (err) {
    console.error("Booking API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}