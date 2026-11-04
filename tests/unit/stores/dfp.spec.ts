import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { DfpConfig, DfpState } from '~/types/models'

import { useDfpStore } from '~/stores/dfp'

const api = vi.hoisted(() => ({
  getCollection: vi.fn(),
  patchResource: vi.fn(),
  postAction: vi.fn()
}))

vi.mock('~/composables/useApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/composables/useApi')>()
  return { ...actual, useApi: () => api }
})

const config: DfpConfig = {
  id: '1',
  forceWashingDuration: 3600,
  forceWashingDurationWhenFrozen: 7200,
  temperatureThresholdWhenFrozen: 2.5,
  waitTimeBetweenWashing: 1800,
  washingDuration: 120,
  startWashingPumpBeforeWashing: 10,
  waitTimeBeforeUnsetSecurity: 300,
  temperatureSensorPolling: 60,
  updatedAt: null,
  createdAt: null,
  version: 1
}

const state: DfpState = {
  id: '1',
  isWashed: false,
  isRunning: true,
  isSecurity: false,
  isEmergencyStopped: false,
  isDisableSecurity: false,
  lastWashing: '2026-01-01T08:00:00Z'
}

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  setActivePinia(createPinia())
})

describe('dfp store', () => {
  it('fetches config and state', async () => {
    api.getCollection.mockImplementation((path: string) =>
      Promise.resolve(path === '/dfp-configs' ? [config] : [state])
    )
    const store = useDfpStore()
    await store.fetchConfig()
    await store.fetchState()
    expect(store.config).toEqual(config)
    expect(store.state).toEqual(state)
  })

  it('returns null when no record is available', async () => {
    api.getCollection.mockResolvedValue([])
    const store = useDfpStore()
    await store.fetchConfig()
    expect(store.config).toBeNull()
  })

  it('saves config via PATCH', async () => {
    const updated = { ...config, washingDuration: 180 }
    api.patchResource.mockResolvedValue(updated)
    const store = useDfpStore()
    const result = await store.saveConfig(updated)
    expect(api.patchResource).toHaveBeenCalledWith('/dfp-configs/1', 'dfp-configs', updated)
    expect(result.washingDuration).toBe(180)
    expect(store.config?.washingDuration).toBe(180)
  })

  it('records fetch and save errors', async () => {
    api.getCollection.mockRejectedValue(new Error('boom'))
    const store = useDfpStore()
    await store.fetchConfig()
    expect(store.error).toBe('boom')

    api.patchResource.mockRejectedValue(new Error('save failed'))
    await expect(store.saveConfig(config)).rejects.toThrow('save failed')
    expect(store.error).toBe('save failed')
  })
})
