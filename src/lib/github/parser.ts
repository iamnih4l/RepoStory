export interface ParsedRepoUrl {
  owner: string;
  repo: string;
  branch?: string;
  subpath?: string;
}

/**
 * Normalizes and validates a GitHub repository URL.
 * Handles:
 * - https://github.com/owner/repo
 * - http://github.com/owner/repo
 * - github.com/owner/repo
 * - owner/repo
 * - https://github.com/owner/repo.git
 * - https://github.com/owner/repo/tree/main/...
 */
export function parseGitHubUrl(input: string): { success: true; data: ParsedRepoUrl } | { success: false; error: string } {
  if (!input || typeof input !== 'string') {
    return { success: false, error: 'Repository URL is required.' };
  }

  const trimmed = input.trim();

  // Strip leading/trailing slashes and whitespace
  let cleaned = trimmed.replace(/^\/+|\/+$/g, '');

  // Strip protocols
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^git@github\.com:/i, '');

  // Check host
  if (cleaned.startsWith('www.')) {
    cleaned = cleaned.substring(4);
  }

  if (cleaned.startsWith('github.com/')) {
    cleaned = cleaned.substring('github.com/'.length);
  } else if (cleaned.includes('/') && !cleaned.includes('.')) {
    // E.g. "owner/repo" shorthand
  } else if (cleaned.includes('gitlab.com') || cleaned.includes('bitbucket.org')) {
    return { success: false, error: 'Currently, only public GitHub repositories are supported.' };
  } else {
    return { success: false, error: 'Please enter a valid GitHub URL, e.g. https://github.com/owner/repository' };
  }

  // Remove .git suffix
  cleaned = cleaned.replace(/\.git$/i, '');

  // Split path segments
  const parts = cleaned.split('/').filter(Boolean);

  if (parts.length < 2) {
    return { success: false, error: 'URL must specify both owner and repository name (e.g. facebook/react).' };
  }

  const owner = parts[0];
  const repo = parts[1];

  // Validate owner and repo names (GitHub naming rules)
  const validNameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!validNameRegex.test(owner) || !validNameRegex.test(repo)) {
    return { success: false, error: 'Invalid characters in repository name or owner.' };
  }

  let branch: string | undefined;
  let subpath: string | undefined;

  if (parts.length >= 4 && parts[2] === 'tree') {
    branch = parts[3];
    if (parts.length > 4) {
      subpath = parts.slice(4).join('/');
    }
  }

  return {
    success: true,
    data: {
      owner,
      repo,
      branch,
      subpath,
    },
  };
}
