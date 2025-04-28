import { LRUCache } from 'lru-cache'

class MemoryCache {
  private cache: LRUCache<string, string>

  constructor() {
    this.cache = new LRUCache<string, string>({
      max: 1000,
      ttl: 1000 * 60 * 60, // 1 hour
    })
  }

  set(key: string, value: string) {
    this.cache.set(key, value)
  }

  get(key: string): string | undefined {
    return this.cache.get(key)
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

export const memory = new MemoryCache()
