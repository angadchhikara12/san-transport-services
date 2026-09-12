import { NextRequest, NextResponse } from "next/server"
import { fetchMutation } from "convex/nextjs"
import { api } from "convex/_generated/api"

interface ContactRequest {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()
    await fetchMutation(api.contact.create, body)
    return NextResponse.json({ contact: { status: "new" } }, { status: 201 })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}