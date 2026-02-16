import type { CacheEntry } from '#types';
import { CACHE_TTL } from '#config';

class Cache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number; // Time to live for cache entries in milliseconds

  constructor(ttl: number = CACHE_TTL) {
    // console.log(`Cache initialized with TTL of ${ttl} ms`);
    this.ttl = ttl;
  }

  get<T = unknown>(key: string): T | null {
    const entry = this.cache.get(key);

    if (entry && entry.expiresAt > Date.now()) {
      return entry.data as T;
    }

    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  set<T = unknown>(key: string, data: T): void {
    // console.log(`Setting cache for key: ${key}`);
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { data, expiresAt });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cacheInstance = new Cache();

export const cache = cacheInstance;
