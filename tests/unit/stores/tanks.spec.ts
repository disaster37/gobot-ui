import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { TankConfig, TankState } from '~/types/models'

import { useTankStore } from '~/stores/tanks'

const api = vi.hoisted(() => ({
  getCollection: vi.fn(),
  patchResource: vi.fn(),
  postAction: vi.fn()
}))

vi.mock('~/composables/useApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/composables/useApi')>()
  return { ...actual, useApi: () => api }
})

const states: TankState[] = [
  { id: '1', level: 120, volume: 480, percent: 80, distance: 30 },
  { id: '2', level: 60, volume: 240, percent: 40, distance: 90 }
]

const configs: TankConfig[] = [
  {
    id: '1',
    updatedAt: null,
    createdAt: null,
    version: 1,
    enable: true,
    name: 'Main pond',
    depth: 150,
    sensorHeight: 120,
    literPerCm: 40
  },
  {
    id: '2',
    updatedAt: null,
    createdAt: null,
    version: 1,
    enable: false,
    name: 'Quarantine',
    depth: 80,
    sensorHeight: 60,
    literPerCm: 15
  }
]

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  setActivePinia(createPinia())
})

describe('tanks store', () => {
  it('fetchAll loads states and configs', async () => {
    api.getCollection.mockImplementation((path: string) =>
      Promise.resolve(path === '/tanks' ? states : configs)
    )
    const store = useTankStore()
    await store.fetchAll()
    expect(store.states).toHaveLength(2)
    expect(store.configs).toHaveLength(2)
    expect(store.loading).toBe(false)
  })

  it('updates the matching config on save', async () => {
    api.getCollection.mockResolvedValue(configs)
    const updated = { ...configs[1]!, name: 'Quarantine v2' }
    api.patchResource.mockResolvedValue(updated)
    const store = useTankStore()
    await store.fetchConfigs()

    await store.saveConfig(updated)

    expect(api.patchResource).toHaveBeenCalledWith('/tank-configs/2', 'tank-configs', updated)
    expect(store.configs[1]?.name).toBe('Quarantine v2')
    expect(store.configs[0]?.name).toBe('Main pond')
  })

  it('records errors without throwing', async () => {
    api.getCollection.mockRejectedValue(new Error('tank down'))
    const store = useTankStore()
    await store.fetchStates()
    expect(store.error).toBe('tank down')

    api.patchResource.mockRejectedValue(new Error('save failed'))
    await expect(store.saveConfig(configs[0]!)).rejects.toThrow('save failed')
    expect(store.error).toBe('save failed')
  })
})
