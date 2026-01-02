import axios, { AxiosError } from "axios"

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

const githubClient = axios.create({
  baseURL: GITHUB_GRAPHQL_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
  timeout: 10_000,
})

githubClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403) {
      console.warn("GitHub rate limit hit")
    }
    return Promise.reject(err)
  }
)

githubClient.interceptors.response.use(
  res => {
    const remaining = res.headers["x-ratelimit-remaining"]
    if (remaining && Number(remaining) < 50) {
      console.warn("GitHub rate limit low:", remaining)
    }
    return res
  },
  Promise.reject
)

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  try {
    const res = await githubClient.post<{
      data: T;
      errors?: { message: string }[];
    }>("", {
      query,
      variables
    })

    if (res.data.errors?.length) {
      console.error(res.data.errors)
      throw new Error("Github GraphQL error")
    }

    return res.data.data
  } catch (err) {
    const error = err as AxiosError

    console.error(
      "[Github GraphQL]",
      error.response?.status,
      error.response?.data || error.message
    )

    throw new Error("Failed to fetch Github GraphQL")
  }
}