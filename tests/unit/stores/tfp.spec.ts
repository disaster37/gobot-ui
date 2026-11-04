import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { TfpConfig, TfpState } from '~/types/models'

import { useTfpStore } from '~/stores/tfp'

const api = vi.hoisted(() => ({
  getCollection: vi.fn(),
  patchResource: vi.fn(),
  postAction: vi.fn()
}))

vi.mock('~/composables/useApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/composables/useApi')>()
  return { ...actual, useApi: () => api }
})

const config: TfpConfig = {
  id: '1',
  UVC1BlisterMaxTime: 8000,
  UVC2BlisterMaxTime: 8000,
  ozoneBlisterMaxTime: 5000,
  isWaterfallAuto: true,
  startTimeWaterfall: '08:00',
  stopTimeWaterfall: '20:00',
  mode: 'UVC',
  UVC1BlisterTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  UVC2BlisterTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  ozoneBlisterTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  updatedAt: null,
  createdAt: null,
  version: 1
}

const state: TfpState = {
  id: '1',
  pondPumpRunning: true,
  UVC1Running: true,
  UVC2Running: false,
  waterfallPumpRunning: false,
  pondBubbleRunning: true,
  filterBubbleRunning: false,
  UVC1BlisterNbHour: 1200,
  UVC2BlisterNbHour: 900,
  ozoneBlisterNbHour: 500,
  acknoledgeWaterfallAuto: true,
  BacteriumTime: null,
  updatedAt: null,
  createdAt: null,
  version: 1
}

function mockCollections(): void {
  api.getCollection.mockImplementation((path: string) => {
    if (path === '/tfp-configs') return Promise.resolve([config])
    if (path === '/tfp-states') return Promise.resolve([state])
    return Promise.resolve([])
  })
}

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  setActivePinia(createPinia())
  mockCollections()
})

describe('tfp store fetching', () => {
  it('fetchAll loads config and state', async () => {
    const store = useTfpStore()
    await store.fetchAll()
    expect(store.config).toEqual(config)
    expect(store.state).toEqual(state)
    expect(store.loading).toBe(false)
  })

  it('selects record id 1 when available', async () => {
    const other = { ...config, id: '2' }
    api.getCollection.mockResolvedValue([other, config])
    const store = useTfpStore()
    await store.fetchConfig()
    expect(store.config?.id).toBe('1')
  })

  it('returns null for empty collections', async () => {
    api.getCollection.mockResolvedValue([])
    const store = useTfpStore()
    await store.fetchAll()
    expect(store.config).toBeNull()
    expect(store.state).toBeNull()
  })

  it('exposes blister getters', async () => {
    const store = useTfpStore()
    await store.fetchConfig()
    expect(store.isUVC1BlisterOk).toBe(true)
    expect(store.isUVC2BlisterOk).toBe(true)
    expect(store.isOzoneBlisterOk).toBe(true)
  })

  it('returns false for blister getters without config', () => {
    const store = useTfpStore()
    expect(store.isUVC1BlisterOk).toBe(false)
  })
})

describe('tfp store saveConfig / saveState', () => {
  it('saves config via PATCH', async () => {
    const updated = { ...config, mode: 'ozone' as const }
    api.patchResource.mockResolvedValue(updated)
    const store = useTfpStore()
    const result = await store.saveConfig(updated)
    expect(api.patchResource).toHaveBeenCalledWith('/tfp-configs/1', 'tfp-configs', updated)
    expect(result.mode).toBe('ozone')
    expect(store.config?.mode).toBe('ozone')
  })

  it('saves state via PATCH', async () => {
    api.patchResource.mockResolvedValue(state)
    const store = useTfpStore()
    const result = await store.saveState(state)
    expect(api.patchResource).toHaveBeenCalledWith('/tfp-states/1', 'tfp-states', state)
    expect(result.id).toBe('1')
  })

  it('records save errors and rethrows', async () => {
    api.patchResource.mockRejectedValue(new Error('conflict'))
    const store = useTfpStore()
    await expect(store.saveConfig(config)).rejects.toThrow('conflict')
    expect(store.error).toBe('conflict')
  })
})

describe('tfp store executeAction', () => {
  it('posts to the endpoint then refreshes state', async () => {
    api.postAction.mockResolvedValue('OK')
    const store = useTfpStore()

    await store.executeAction('startPondPump')

    expect(api.postAction).toHaveBeenCalledWith('/tfps/action/start_pond_pump')
    expect(api.getCollection).toHaveBeenCalledWith('/tfp-configs')
    expect(api.getCollection).toHaveBeenCalledWith('/tfp-states')
    expect(store.actionLoading.startPondPump).toBe(false)
  })

  it('prevents concurrent duplicate calls', async () => {
    let resolvePost: (value: string) => void = () => {}
    api.postAction.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolvePost = resolve
        })
    )
    const store = useTfpStore()

    const first = store.executeAction('startUVC1')
    const second = store.executeAction('startUVC1')

    expect(api.postAction).toHaveBeenCalledTimes(1)
    resolvePost('OK')
    await Promise.all([first, second])
    expect(store.actionLoading.startUVC1).toBe(false)
  })

  it('handles action errors', async () => {
    api.postAction.mockRejectedValue(new Error('action failed'))
    const store = useTfpStore()
    await store.executeAction('changeOzoneBlister')
    expect(store.error).toBe('action failed')
  })
})
