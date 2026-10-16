// Client-side local storage utility for Bring Your Own Key (BYOK)

const GEMINI_KEY_STORAGE = 'repostory_custom_gemini_key';
const GITHUB_TOKEN_STORAGE = 'repostory_custom_github_token';

export function getStoredGeminiKey(): string | null {
  if (typeof window === 'undefined') return null;
  const key = localStorage.getItem(GEMINI_KEY_STORAGE);
  return key && key.trim().length > 0 ? key.trim() : null;
}

export function setStoredGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = key.trim();
  if (trimmed) {
    localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
  } else {
    clearStoredGeminiKey();
  }
}

export function clearStoredGeminiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GEMINI_KEY_STORAGE);
}

export function getStoredGitHubToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(GITHUB_TOKEN_STORAGE);
  return token && token.trim().length > 0 ? token.trim() : null;
}

export function setStoredGitHubToken(token: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = token.trim();
  if (trimmed) {
    localStorage.setItem(GITHUB_TOKEN_STORAGE, trimmed);
  } else {
    clearStoredGitHubToken();
  }
}

export function clearStoredGitHubToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GITHUB_TOKEN_STORAGE);
}

export function getClientApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const geminiKey = getStoredGeminiKey();
  const ghToken = getStoredGitHubToken();

  if (geminiKey) {
    headers['x-gemini-key'] = geminiKey;
  }
  if (ghToken) {
    headers['x-github-token'] = ghToken;
  }

  return headers;
}

export function maskSecret(secret?: string | null): string {
  if (!secret) return '';
  if (secret.length <= 8) return '••••••••';
  return `${secret.slice(0, 4)}••••${secret.slice(-4)}`;
}
