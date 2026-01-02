import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
  }
})

export interface githubOwner {
  avatar_url: string
  events_url: string
  followers_url: string
  following_url: string
  gists_url: string
  gravatar_id: string
  html_url: string
  id: number
  login: string
  node_id: string
  organizations_url: string
  received_events_url: string
  repos_url: string
  site_admin: boolean
  starred_url: string
  subscriptions_url: string
  type: string
  url: string
  user_view_type: string
}

export interface githubRepoLicense {
  key: string
  name: string
  node_id: string
  spdx_id: string
  url: string
}

export interface githubRepo {
  allow_forking: boolean
  archive_url: string
  achived: boolean
  assignees_url: string
  blobs_url: string
  branches_url: string
  clone_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  created_at: string
  default_branch: string
  deployments_url: string
  description: string
  disabled: boolean
  downloads_url: string
  events_url: string
  fork: boolean
  forks: number
  forks_count: number
  forks_url: string
  full_name: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  git_url: string
  has_discussions: boolean
  has_downloads: boolean
  has_issues: boolean
  has_pages: boolean
  has_projects: boolean
  has_wiki: boolean
  homepage: string | null
  hooks_url: string
  html_url: string
  id: number
  is_template: boolean
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  language: string | null
  languages_url: string
  license?: githubRepoLicense
  merges_url: string
  milestones_url: string
  mirror_url: string | null
  name: string
  node_id: string
  notification_url: string
  open_issues: number
  open_issues_count: number
  owner: githubOwner
  private: boolean
  pulls_url: string
  pushed_at: string
  releases_url: string
  size: number
  ssh_url: string
  stargazers_count: number
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  svn_url: string
  tags_url: string
  teams_url: string
  topics: []
  trees_url: string
  updated_at: string
  url: string
  visibility: string
  watchers: number
  watchers_count: number
  web_commit_signoff_required: boolean
}

export interface githubUserSearchItem {
  node: {
    avatarUrl: string
    description?: string
    bio?: string
    login: string
    name: string
    __typename: string
  }
}

export interface githubUserSearch {
  data: {
    rateLimit: {
      limit: number,
      remaining: number,
      resetAt: string,
    },
    search: {
      edges: githubUserSearchItem[],
    },
    pageInfo: {
      endCursor: string
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
  }
}

export interface githubRateLimit {
  rate: {
    limit: number
    remaining: number
    reset: number
    resource: string
    used: number
  }
  resources: {
    code_search: {
      limit: number
      remaining: number
      reset: number
      resource: string
      used: number
    }
    core: {
      limit: number
      remaining: number
      reset: number
      resource: string
      used: number
    }
    graphql: {
      limit: number
      remaining: number
      reset: number
      resource: string
      used: number
    }
    integration_manifest: {
      limit: number
      remaining: number
      reset: number
      resource: string
      used: number
    }
    search: {
      limit: number
      remaining: number
      reset: number
      resource: string
      used: number
    }
  }
}

export interface githubUserInfo {
  avatar_url: string
  bio: string
  blog: string
  company: string | null
  created_at: string
  email: string | null
  events_url: string
  followers: number
  followers_url: string
  following: number
  following_url: string
  gists_url: string
  gravatar_id: string
  hireable: boolean | null
  html_url: string
  id: number
  location: string
  login: string
  name: string
  node_id: string
  organizations_url: string
  public_gists: number
  public_repos: number
  received_events_url: string
  repos_url: string
  site_admin: boolean
  starred_url: string
  subscriptions_url: string
  twitter_username: string | null
  type: string
  updated_at: string
  url: string
  user_view_type: string
}

class githubAPI {
  static async searchUser (query: string, limit: number, cursor: string | null): Promise<githubUserSearch> {
    try {
      const response = await axios.get(`/api/github/search?q=${query}&limit=${limit}` + (cursor ? `&cursor=${cursor}` : ''))
      return response.data
    } catch (err) {
      throw err
    }
  }

  static async rateLimit () {
    try {
      const response = await axios.get('/api/github/rate_limit')
      return response.data
    } catch (err) {
      throw err
    }
  }

  static async userInfo (owner: string): Promise<githubUserInfo> {
    try {
      const response = await axios.get(`/api/github/users/${owner}`)
      return response.data
    } catch (err) {
      throw err
    }
  }

  static async userRepos (owner: string, per_page: number, page: number): Promise<githubRepo[]> {
    try {
      const response = await axios.get(`/api/github/repos/${owner}?per_page=${per_page}&page=${page}`)
      console.log(response.data)
      return response.data
    } catch (err) {
      throw err
    }
  }
}

export { githubAPI }