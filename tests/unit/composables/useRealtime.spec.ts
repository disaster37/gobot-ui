import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useRealtimeRefresh, type RealtimeController } from '~/composables/useRealtime'

function mountRealtime(intervalMs: number, onRefresh: () => Promise<void>) {
  let controller: RealtimeController
  const Harness = defineComponent({
    setup() {
      controller = useRealtimeRefresh({ intervalMs, onRefresh })
      return () => h('div')
    }
  })
  const wrapper = mount(Harness)
  return { wrapper, controller: controller! }
}

describe('useRealtimeRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('refreshes immediately on mount and on refreshNow()', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { controller } = mountRealtime(1000, onRefresh)
    await vi.runOnlyPendingTimersAsync()
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(controller.lastUpdatedAt.value).toBeInstanceOf(Date)

    await controller.refreshNow()
    expect(onRefresh).toHaveBeenCalledTimes(2)
  })

  it('polls on every interval tick until stopped', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { controller } = mountRealtime(1000, onRefresh)
    await vi.runOnlyPendingTimersAsync()
    onRefresh.mockClear()

    controller.start()
    expect(controller.isPolling.value).toBe(true)

    await vi.advanceTimersByTimeAsync(3000)
    expect(onRefresh).toHaveBeenCalledTimes(3)

    controller.stop()
    expect(controller.isPolling.value).toBe(false)
    await vi.advanceTimersByTimeAsync(3000)
    expect(onRefresh).toHaveBeenCalledTimes(3)
  })

  it('does not start when the interval is disabled', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { controller } = mountRealtime(0, onRefresh)
    controller.start()
    expect(controller.isPolling.value).toBe(false)
  })

  it('does not overlap polling ticks while a refresh is in flight', async () => {
    let resolveRefresh: () => void = () => {}
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve
        })
    )
    const { controller } = mountRealtime(1000, onRefresh)

    // The mount refresh is still pending (never resolved).
    expect(onRefresh).toHaveBeenCalledTimes(1)

    controller.start()
    await vi.advanceTimersByTimeAsync(5000)
    // Five interval ticks fired but were all skipped while the first is in flight.
    expect(onRefresh).toHaveBeenCalledTimes(1)

    resolveRefresh()
    await vi.advanceTimersByTimeAsync(1000)
    // The guard released after completion, so the next tick runs.
    expect(onRefresh).toHaveBeenCalledTimes(2)
  })

  it('releases the in-flight guard after a failed refresh', async () => {
    const onRefresh = vi.fn().mockRejectedValue(new Error('boom'))
    const { controller } = mountRealtime(1000, onRefresh)

    await vi.runOnlyPendingTimersAsync()
    expect(onRefresh).toHaveBeenCalledTimes(1)

    controller.start()
    await vi.advanceTimersByTimeAsync(2000)
    // Polling keeps ticking even though every refresh rejects.
    expect(onRefresh).toHaveBeenCalledTimes(3)
  })

  it('exposes the dispatchServerEvent SSE seam', () => {
    const { controller } = mountRealtime(1000, vi.fn().mockResolvedValue(undefined))
    expect(() => controller.dispatchServerEvent('tfp-states', { id: '1' })).not.toThrow()
  })
})
