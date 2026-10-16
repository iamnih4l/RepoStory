export interface GitHubRepoMeta {
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  default_branch: string;
  topics?: string[];
  license?: { name: string; spdx_id?: string } | null;
  private: boolean;
  size: number;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isRateLimit: boolean = false
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export class GitHubClient {
  private token?: string;
  private baseUrl = 'https://api.github.com';

  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoStory-Visual-Learning-Engine/1.0',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async getRepo(owner: string, repo: string): Promise<GitHubRepoMeta> {
    const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new GitHubApiError(`Repository '${owner}/${repo}' was not found. Please verify the URL is public and spelled correctly.`, 404);
      }
      if (res.status === 403 || res.status === 429) {
        const resetHeader = res.headers.get('x-ratelimit-reset');
        const resetTime = resetHeader ? new Date(parseInt(resetHeader, 10) * 1000).toLocaleTimeString() : 'soon';
        throw new GitHubApiError(
          `GitHub API rate limit exceeded. Resets at ${resetTime}. Configure GITHUB_TOKEN in .env.local to increase limit.`,
          403,
          true
        );
      }
      throw new GitHubApiError(`GitHub API error (${res.status}): ${res.statusText}`, res.status);
    }

    const data: GitHubRepoMeta = await res.json();
    if (data.private) {
      throw new GitHubApiError(`Repository '${owner}/${repo}' is private. RepoStory currently supports public repositories.`, 400);
    }
    return data;
  }

  async getLatestCommitSha(owner: string, repo: string, branch: string): Promise<string> {
    const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(branch)}`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return branch; // fallback to branch name if commit fetch fails
    }

    const data = await res.json();
    return data.sha || branch;
  }

  async getReadme(owner: string, repo: string): Promise<string> {
    const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
    const res = await fetch(url, {
      headers: {
        ...this.getHeaders(),
        Accept: 'application/vnd.github.v3.raw',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return '';
    }

    return await res.text();
  }

  async getTree(owner: string, repo: string, sha: string): Promise<GitHubTreeItem[]> {
    const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(sha)}?recursive=1`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.tree as GitHubTreeItem[]) || [];
  }

  async getRawFileContent(owner: string, repo: string, filePath: string, ref: string): Promise<string | null> {
    const url = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(ref)}/${filePath}`;
    const res = await fetch(url, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.text();
  }
}
