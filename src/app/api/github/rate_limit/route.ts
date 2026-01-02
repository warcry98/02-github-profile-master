import { axiosInstance } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axiosInstance.get('/rate_limit')
    const data = response.data

    return NextResponse.json(data)
  } catch (error) {
    console.error('API call error:', error)
    return NextResponse.json({ message: 'Error fetching data'}, { status: 500 })
  }
}