import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

type SearchUsersVariables = {
  query: string
  type: "USER"
  first: number
  after?: string
}


const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

const SEARCH_USERS_QUERY = `
query SearchUsers(
  $query: String!
  $type: SearchType!
  $first: Int!
  $after: String
) {
  rateLimit {
    limit
    remaining
    resetAt
  }
  search(
    query: $query
    type: $type
    first: $first
    after: $after
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
    }
    edges {
      node {
        __typename
        ... on User {
          login
          name
          bio
          avatarUrl
        }
        ... on Organization {
          login
          name
          description
          avatarUrl
        }
      }
    }
  }
}
`

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const q = searchParams.get("q")

  if (!q) {
    return NextResponse.json(
      { message: "Missing query parameter" },
      { status: 400 }
    )
  }

  const query = `${searchParams.get("q")} in:login in:name`
  const limit = Number(searchParams.get("limit") ?? 5)
  const cursor = searchParams.get("cursor")

  try {
    const variables: SearchUsersVariables = {
        query,
        type: "USER",
        first: Math.min(limit, 50), // GitHub hard safety
      }
    
    if (cursor) {
      variables["after"] = cursor
    }

    const res = await axios.post(
      GITHUB_GRAPHQL_URL,
      {
        query: SEARCH_USERS_QUERY,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = res.data

    return NextResponse.json(data)
  } catch (err) {
    console.error("GitHub GraphQL error:", err)

    return NextResponse.json(
      { message: "GitHub API error" },
      { status: 500 }
    )
  }
}