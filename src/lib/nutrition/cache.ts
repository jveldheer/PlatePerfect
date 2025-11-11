// Simple LRU cache for nutrition data
// Reduces API calls for frequently looked-up foods

interface CacheEntry<T> {
  value: T;
  expires: number;
}

class SimpleLRU<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

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
    // Remove if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton cache instance
const nutritionCache = new SimpleLRU<any>(1000);

// TTLs
const TTL_OFF = 60 * 60 * 1000; // 1 hour for OFF
const TTL_FDC = 24 * 60 * 60 * 1000; // 24 hours for FDC

/**
 * Get cached value
 */
export function getCached(key: string): any | undefined {
  return nutritionCache.get(key);
}

/**
 * Set cached value with appropriate TTL based on source
 */
export function setCached(key: string, value: any, source: 'off' | 'fdc' = 'off'): void {
  const ttl = source === 'off' ? TTL_OFF : TTL_FDC;
  nutritionCache.set(key, value, ttl);
}

/**
 * Generate cache key for UPC lookup
 */
export function upcCacheKey(upc: string): string {
  return `upc:${upc}`;
}

/**
 * Generate cache key for name/text lookup
 * Normalizes the query to improve cache hits
 */
export function nameCacheKey(query: string): string {
  const normalized = query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace

  return `name:${normalized}`;
}

/**
 * Clear all cached nutrition data
 */
export function clearCache(): void {
  nutritionCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: nutritionCache.size(),
    maxSize: 1000,
  };
}
