/**
 * In-memory LRU cache for nutrition data
 */

import { LRUCache } from "lru-cache";
import type { Macro } from "./types";

type CacheEntry = {
  data: Macro;
  source: "off" | "fdc";
  timestamp: number;
};

const CACHE_MAX_SIZE = 1000;
const OFF_TTL = 60 * 60 * 1000; // 1 hour for OFF
const FDC_TTL = 24 * 60 * 60 * 1000; // 24 hours for FDC

// Create separate caches for different lookup types
const upcCache = new LRUCache<string, CacheEntry>({
  max: CACHE_MAX_SIZE,
  ttl: OFF_TTL,
});

const nameCache = new LRUCache<string, CacheEntry>({
  max: CACHE_MAX_SIZE,
  ttl: FDC_TTL,
});

/**
 * Generate a canonical key from a name/text query
 * Normalizes to lowercase and removes extra whitespace
 */
function canonicalNameKey(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Get cached macro data by UPC
 */
export function getCachedByUPC(upc: string): Macro | null {
  const key = `upc:${upc}`;
  const entry = upcCache.get(key);

  if (!entry) return null;

  // Check if TTL has expired based on source
  const now = Date.now();
  const ttl = entry.source === "off" ? OFF_TTL : FDC_TTL;

  if (now - entry.timestamp > ttl) {
    upcCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Cache macro data by UPC
 */
export function setCachedByUPC(upc: string, data: Macro): void {
  const key = `upc:${upc}`;
  upcCache.set(key, {
    data,
    source: data.source,
    timestamp: Date.now(),
  });
}

/**
 * Get cached macro data by name/text query
 */
export function getCachedByName(name: string): Macro | null {
  const key = `name:${canonicalNameKey(name)}`;
  const entry = nameCache.get(key);

  if (!entry) return null;

  // Check if TTL has expired based on source
  const now = Date.now();
  const ttl = entry.source === "off" ? OFF_TTL : FDC_TTL;

  if (now - entry.timestamp > ttl) {
    nameCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Cache macro data by name/text query
 */
export function setCachedByName(name: string, data: Macro): void {
  const key = `name:${canonicalNameKey(name)}`;
  nameCache.set(key, {
    data,
    source: data.source,
    timestamp: Date.now(),
  });
}

/**
 * Clear all caches
 */
export function clearCache(): void {
  upcCache.clear();
  nameCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    upc: {
      size: upcCache.size,
      max: CACHE_MAX_SIZE,
    },
    name: {
      size: nameCache.size,
      max: CACHE_MAX_SIZE,
    },
  };
}
