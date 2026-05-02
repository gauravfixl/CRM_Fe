"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Stale-While-Revalidate cache for backend responses.
// On mount the hook synchronously hydrates from sessionStorage so the first
// render already has data — no spinner on revisit. A background fetch then
// overwrites the cache and re-renders with fresh data, keeping the UI dynamic.
// Cache scope is per-tab (sessionStorage), so it never outlives the user's session.

const CACHE_PREFIX = "swr_cache:v1:"

type CacheEntry<T> = {
  data: T
  timestamp: number
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function readCache<T>(key: string): T | null {
  const store = safeStorage()
  if (!store) return null
  try {
    const raw = store.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    return entry.data
  } catch {
    return null
  }
}

export function writeCache<T>(key: string, data: T): void {
  const store = safeStorage()
  if (!store) return
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    store.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // sessionStorage quota or serialization failed — non-critical, fall through
  }
}

export function invalidateCache(key: string): void {
  const store = safeStorage()
  if (!store) return
  store.removeItem(CACHE_PREFIX + key)
}

// Drop every cached entry whose key starts with `prefix` — useful after a
// mutation that affects multiple cached views (e.g. all `roles:*` after a
// role create/delete).
export function invalidateCachePrefix(prefix: string): void {
  const store = safeStorage()
  if (!store) return
  const fullPrefix = CACHE_PREFIX + prefix
  const toRemove: string[] = []
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i)
    if (k && k.startsWith(fullPrefix)) toRemove.push(k)
  }
  toRemove.forEach((k) => store.removeItem(k))
}

export function clearAllCache(): void {
  const store = safeStorage()
  if (!store) return
  const toRemove: string[] = []
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i)
    if (k && k.startsWith(CACHE_PREFIX)) toRemove.push(k)
  }
  toRemove.forEach((k) => store.removeItem(k))
}

type UseCachedFetchOptions = {
  enabled?: boolean
  safetyTimeoutMs?: number
}

export type UseCachedFetchResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
  fromCache: boolean
  refetch: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<T | null>>
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedFetchOptions = {}
): UseCachedFetchResult<T> {
  const { enabled = true, safetyTimeoutMs = 20_000 } = options

  // Resolve cached value once, synchronously, before the first commit so the
  // initial render already has it.
  const initialDataRef = useRef<T | null | undefined>(undefined)
  if (initialDataRef.current === undefined) {
    initialDataRef.current = enabled ? readCache<T>(key) : null
  }

  const [data, setData] = useState<T | null>(initialDataRef.current)
  const [loading, setLoading] = useState<boolean>(!initialDataRef.current && enabled)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState<boolean>(initialDataRef.current !== null)

  // StrictMode in dev double-mounts the effect — without this guard two
  // parallel fetches fire and one can be cancelled mid-flight, leaving
  // loading=true forever if the survivor hangs.
  const initialized = useRef(false)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    // axios in this repo has no global timeout; this safety net forces the
    // spinner off so the UI can recover and show a Retry control.
    const safety = setTimeout(() => {
      console.warn(`[swrCache] "${key}" safety timeout fired`)
      setError("Request timed out — backend may be unreachable")
      setLoading(false)
    }, safetyTimeoutMs)
    try {
      const fresh = await fetcherRef.current()
      writeCache(key, fresh)
      setData(fresh)
      setFromCache(false)
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Failed to load"
      console.warn(`[swrCache] "${key}" failed:`, msg)
      setError(msg)
    } finally {
      clearTimeout(safety)
      setLoading(false)
    }
  }, [key, enabled, safetyTimeoutMs])

  useEffect(() => {
    if (!enabled) return
    if (initialized.current) return
    initialized.current = true
    refetch()
  }, [enabled, refetch])

  return { data, loading, error, fromCache, refetch, setData }
}
