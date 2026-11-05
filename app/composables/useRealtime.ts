import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export interface RealtimeOptions {
  /** Polling interval in ms while SSE is not yet integrated. Default: 15000 (15s). Set 0 to disable. */
  intervalMs?: number
  /** Async callback invoked on each refresh tick */
  onRefresh: () => Promise<void>
}

export interface RealtimeController {
  isPolling: Readonly<Ref<boolean>>
  lastUpdatedAt: Readonly<Ref<Date | null>>
  refreshNow: () => Promise<void>
  start: () => void
  stop: () => void
  /**
   * SEAM FOR NEXT PR (SSE):
   * When SSE is introduced, EventSource messages will call
   * dispatchServerEvent(type, resource) to mutate Pinia stores directly,
   * and start() will open an EventSource instead of setInterval.
   */
  dispatchServerEvent: (resourceType: string, payload: unknown) => void
}

export function useRealtimeRefresh(options: RealtimeOptions): RealtimeController {
  const intervalMs = options.intervalMs ?? 15000
  const isPolling = ref(false)
  const lastUpdatedAt = ref<Date | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null
  let inFlight = false

  async function refreshNow(): Promise<void> {
    // Guard against overlapping refreshes: a slow onRefresh() (>intervalMs) must
    // not stack behind the next interval tick. The flag is released on both
    // success and failure so a single rejection never wedges polling.
    if (inFlight) return
    inFlight = true
    try {
      await options.onRefresh()
      lastUpdatedAt.value = new Date()
    } finally {
      inFlight = false
    }
  }

  // Used for the mount load and polling ticks: errors are surfaced to direct
  // callers of refreshNow(), while fire-and-forget callers must not produce
  // unhandled rejections.
  function fireAndForgetRefresh(): void {
    void refreshNow().catch(() => {})
  }

  function start(): void {
    if (isPolling.value || intervalMs <= 0) return
    isPolling.value = true
    timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      fireAndForgetRefresh()
    }, intervalMs)
  }

  function stop(): void {
    isPolling.value = false
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  function dispatchServerEvent(resourceType: string, payload: unknown): void {
    // Placeholder kept intentionally empty: the next PR wires EventSource
    // messages into the Pinia stores through this method.
    void resourceType
    void payload
  }

  onMounted(() => {
    fireAndForgetRefresh()
    if (import.meta.env?.MODE !== 'test') start()
  })

  onUnmounted(stop)

  return { isPolling, lastUpdatedAt, refreshNow, start, stop, dispatchServerEvent }
}
