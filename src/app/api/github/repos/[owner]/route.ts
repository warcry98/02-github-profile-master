import { axiosInstance } from "@/lib/api"
import { NextRequest, NextResponse } from "next/server"


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
  const { searchParams } = new URL(request.url)

  const per_page = Number(searchParams.get("per_page") ?? 4)
  const page = Number(searchParams.get("page") ?? 1)

  try {
      const response = await axiosInstance.get(`/users/${owner}/repos?per_page=${per_page}&page=${page}`)
      const data = response.data
  
      return NextResponse.json(data)
    } catch (error) {
      console.error('API call error:', error)
      return NextResponse.json({ message: 'Error fetching data'}, { status: 500 })
    }
}