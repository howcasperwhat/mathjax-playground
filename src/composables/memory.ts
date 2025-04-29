// import { LRUCache } from 'lru-cache'

// class MemoryCache {
//   public static readonly MAX_SIZE = 2e6
//   private cache: LRUCache<string, string>

//   constructor(initial?: Record<string, string>) {
//     this.cache = new LRUCache<string, string>({
//       maxSize: MemoryCache.MAX_SIZE,
//       sizeCalculation: (value, key) => {
//         return value.length + key.length
//       },
//       ttl: 1000 * 60 * 5,
//     })
//     initial && Object.entries(initial).forEach(([key, value]) => {
//       this.cache.set(key, value)
//     })
//   }

//   set(key: string, value: string) {
//     this.cache.set(key, value)
//   }

//   get(key: string): string | undefined {
//     return this.cache.get(key)
//   }

//   delete(key: string) {
//     this.cache.delete(key)
//   }

//   clear() {
//     this.cache.clear()
//   }
// }

// export const memory = new MemoryCache()
