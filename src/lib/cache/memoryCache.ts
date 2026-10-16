export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  expiresAt: number;
  hits: number;
}

export interface CacheMetrics {
  totalHits: number;
  totalMisses: number;
  size: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private totalHits = 0;
  private totalMisses = 0;
  private defaultTtlMs = 1000 * 60 * 60 * 24; // 24 hours

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.totalMisses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    entry.hits++;
    this.totalHits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    // Limit cache size to 500 items to prevent memory bloat
    if (this.cache.size > 500) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttlMs || this.defaultTtlMs),
      hits: 0,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getMetrics(): CacheMetrics {
    return {
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      size: this.cache.size,
    };
  }
}

// Global singleton across hot reloads in dev
const globalForCache = globalThis as unknown as { repoStoryCache?: MemoryCache };

export const memoryCache = globalForCache.repoStoryCache ?? new MemoryCache();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.repoStoryCache = memoryCache;
}
