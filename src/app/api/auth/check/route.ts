import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")

    if (!token) {
      return new NextResponse(null, { status: 401 })
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}