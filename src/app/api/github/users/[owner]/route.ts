import { axiosInstance } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";


interface RouteContext {
  params: Promise<{
    owner: string
  }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const { owner } = await context.params

  try {
    const response = await axiosInstance.get(`/users/${owner}`)
    const data = response.data

    return NextResponse.json(data)
  } catch (error) {
    console.error('API call error:', error)
    return NextResponse.json({ message: 'Error fetching data'}, { status: 500 })
  }
}