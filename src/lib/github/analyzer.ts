import { GitHubClient, GitHubTreeItem, GitHubRepoMeta } from './client';
import { RepoMetadata } from '../types/lesson';

export interface SelectedFileContent {
  path: string;
  content: string;
  charCount: number;
  isManifest?: boolean;
  isEntryPoint?: boolean;
}

export interface AnalyzedRepoContext {
  meta: RepoMetadata;
  readmeExcerpt: string;
  primaryLanguage: string;
  detectedEcosystem: string;
  selectedFiles: SelectedFileContent[];
  totalContextChars: number;
  treeOverview: string[];
}

const IGNORED_PATH_PATTERNS = [
  /(^|\/)\.git\//,
  /(^|\/)node_modules\//,
  /(^|\/)vendor\//,
  /(^|\/)dist\//,
  /(^|\/)build\//,
  /(^|\/)\.next\//,
  /(^|\/)__pycache__\//,
  /(^|\/)\.venv\//,
  /(^|\/)venv\//,
  /(^|\/)target\//,
  /(^|\/)\.cache\//,
  /(^|\/)\.github\//,
  /(^|\/)coverage\//,
  /(^|\/)test(s)?\/snapshots\//,
  /\.(png|jpe?g|gif|svg|webp|ico|pdf|zip|tar|gz|exe|dll|so|dylib|wasm|mp4|webm|mp3)$/i,
  /(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|Gemfile\.lock)$/i,
  /\.min\.(js|css)$/i,
  /\.map$/i,
];

const MANIFEST_PATTERNS = [
  /^package\.json$/i,
  /^pyproject\.toml$/i,
  /^requirements\.txt$/i,
  /^Cargo\.toml$/i,
  /^go\.mod$/i,
  /^Dockerfile$/i,
  /^docker-compose\.ya?ml$/i,
];

const ENTRY_POINT_PATTERNS = [
  /^(src\/)?(index|main|app|server)\.(ts|js|jsx|tsx|py|go|rs)$/i,
  /^(cmd\/)?main\.go$/i,
  /^(src\/)?lib\.rs$/i,
  /^(app\/)?page\.(tsx|jsx|js)$/i,
];

export function redactSecrets(text: string): string {
  if (!text) return '';
  return text
    // API keys & JWT tokens
    .replace(/(?:api[_-]?key|secret|token|password|auth|bearer)["']?\s*[:=]\s*["']?([a-zA-Z0-9_\-.]{16,})["']?/gi, '$1: "[REDACTED_SECRET]"')
    .replace(/ghp_[a-zA-Z0-9]{36}/g, '[REDACTED_GITHUB_TOKEN]')
    .replace(/sk-[a-zA-Z0-9]{32,}/g, '[REDACTED_AI_KEY]')
    .replace(/AIzaSy[a-zA-Z0-9_-]{33}/g, '[REDACTED_GOOGLE_KEY]');
}

export class RepoAnalyzer {
  private client: GitHubClient;

  constructor(client?: GitHubClient) {
    this.client = client || new GitHubClient();
  }

  async analyze(owner: string, repo: string): Promise<AnalyzedRepoContext> {
    // 1. Fetch metadata
    const rawMeta = await this.client.getRepo(owner, repo);
    const commitSha = await this.client.getLatestCommitSha(owner, repo, rawMeta.default_branch);

    const meta: RepoMetadata = {
      owner: rawMeta.owner.login,
      name: rawMeta.name,
      fullName: rawMeta.full_name,
      description: rawMeta.description || 'Open source GitHub project',
      stars: rawMeta.stargazers_count,
      forks: rawMeta.forks_count,
      language: rawMeta.language || 'Unknown',
      url: rawMeta.html_url,
      defaultBranch: rawMeta.default_branch,
      commitSha: commitSha.slice(0, 7),
      license: rawMeta.license?.name,
      topics: rawMeta.topics || [],
    };

    // 2. Fetch README
    const rawReadme = await this.client.getReadme(owner, repo);
    // Truncate README safely to ~4,000 characters
    const readmeExcerpt = redactSecrets(rawReadme.slice(0, 4000));

    // 3. Fetch file tree
    const tree = await this.client.getTree(owner, repo, commitSha);

    // Filter candidate blobs
    const eligibleBlobs = tree.filter((item) => {
      if (item.type !== 'blob') return false;
      if (IGNORED_PATH_PATTERNS.some((p) => p.test(item.path))) return false;
      // Skip files larger than 150KB
      if (item.size && item.size > 150 * 1024) return false;
      return true;
    });

    // 4. Rank and select up to 12 files
    const selectedPaths = this.selectTopFiles(eligibleBlobs);

    // 5. Fetch selected file contents within budget (~20,000 chars)
    const MAX_TOTAL_CHARS = 20000;
    let currentTotalChars = 0;
    const selectedFiles: SelectedFileContent[] = [];

    for (const item of selectedPaths) {
      if (currentTotalChars >= MAX_TOTAL_CHARS) break;

      const rawContent = await this.client.getRawFileContent(owner, repo, item.path, commitSha);
      if (!rawContent) continue;

      // Truncate per file if overly large
      const maxFileChars = Math.min(3000, MAX_TOTAL_CHARS - currentTotalChars);
      const truncated = rawContent.slice(0, maxFileChars);
      const safeContent = redactSecrets(truncated);

      currentTotalChars += safeContent.length;
      selectedFiles.push({
        path: item.path,
        content: safeContent,
        charCount: safeContent.length,
        isManifest: item.isManifest,
        isEntryPoint: item.isEntryPoint,
      });
    }

    // Determine ecosystem
    const detectedEcosystem = this.detectEcosystem(selectedFiles, meta.language);

    // Sample tree overview (top 30 paths for context)
    const treeOverview = eligibleBlobs.slice(0, 35).map((b) => b.path);

    return {
      meta,
      readmeExcerpt,
      primaryLanguage: meta.language,
      detectedEcosystem,
      selectedFiles,
      totalContextChars: currentTotalChars,
      treeOverview,
    };
  }

  private selectTopFiles(blobs: GitHubTreeItem[]): Array<GitHubTreeItem & { isManifest?: boolean; isEntryPoint?: boolean }> {
    const scored: Array<GitHubTreeItem & { score: number; isManifest?: boolean; isEntryPoint?: boolean }> = [];

    for (const blob of blobs) {
      let score = 0;
      let isManifest = false;
      let isEntryPoint = false;

      // Manifest files (high priority)
      if (MANIFEST_PATTERNS.some((p) => p.test(blob.path))) {
        score += 100;
        isManifest = true;
      }

      // Entry point files
      if (ENTRY_POINT_PATTERNS.some((p) => p.test(blob.path))) {
        score += 80;
        isEntryPoint = true;
      }

      // Root level or src files
      const depth = blob.path.split('/').length;
      if (depth === 1) score += 20;
      else if (depth === 2 && blob.path.startsWith('src/')) score += 15;
      else if (depth > 4) score -= 10;

      // Core architectural keywords in path
      const lower = blob.path.toLowerCase();
      if (lower.includes('core') || lower.includes('engine') || lower.includes('pipeline') || lower.includes('retriever')) {
        score += 30;
      } else if (lower.includes('model') || lower.includes('agent') || lower.includes('service') || lower.includes('api')) {
        score += 25;
      } else if (lower.includes('example') || lower.includes('demo') || lower.includes('tutorial')) {
        score += 15;
      } else if (lower.includes('test') || lower.includes('spec')) {
        score -= 40;
      }

      scored.push({ ...blob, score, isManifest, isEntryPoint });
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Pick top 12
    return scored.slice(0, 12);
  }

  private detectEcosystem(selectedFiles: SelectedFileContent[], fallbackLang: string): string {
    const paths = selectedFiles.map((f) => f.path.toLowerCase());
    if (paths.some((p) => p.includes('package.json'))) return 'Node.js / TypeScript';
    if (paths.some((p) => p.includes('pyproject.toml') || p.includes('requirements.txt'))) return 'Python';
    if (paths.some((p) => p.includes('cargo.toml'))) return 'Rust';
    if (paths.some((p) => p.includes('go.mod'))) return 'Go';
    if (paths.some((p) => p.includes('pom.xml') || p.includes('build.gradle'))) return 'Java / Kotlin';
    return fallbackLang || 'General Software';
  }
}
