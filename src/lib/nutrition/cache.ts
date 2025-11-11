// Simple in-memory LRU cache for nutrition data

interface CacheEntry<T> {
  value: T;
  expires: number;
}

class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
const nutritionCache = new LRUCache<any>(1000);

// TTL constants
export const TTL = {
  OFF: 60 * 60 * 1000, // 1 hour
  FDC: 24 * 60 * 60 * 1000, // 24 hours
};

export function getCache() {
  return nutritionCache;
}

/**
 * Generate cache key for UPC lookups
 */
export function upcCacheKey(upc: string): string {
  return `upc:${upc}`;
}

/**
 * Generate cache key for name-based lookups
 */
export function nameCacheKey(name: string, formTokens?: string[]): string {
  const canonical = [
    name.toLowerCase().trim(),
    ...(formTokens || [])
  ].join('_');
  return `name:${canonical}`;
}
