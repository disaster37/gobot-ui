import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useBoardStore } from '~/stores/boards'

const api = vi.hoisted(() => ({
  getCollection: vi.fn(),
  patchResource: vi.fn(),
  postAction: vi.fn()
}))

vi.mock('~/composables/useApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/composables/useApi')>()
  return { ...actual, useApi: () => api }
})

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  setActivePinia(createPinia())
})

describe('boards store', () => {
  it('populates boards from the API', async () => {
    api.getCollection.mockResolvedValue([
      { id: 'dfp', name: 'DFP board', isOnline: true },
      { id: 'tfp', name: 'TFP board', isOnline: false }
    ])
    const store = useBoardStore()

    const boards = await store.fetchBoards()

    expect(api.getCollection).toHaveBeenCalledWith('/boards')
    expect(boards).toHaveLength(2)
    expect(store.boards[0]?.isOnline).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('handles empty responses', async () => {
    api.getCollection.mockResolvedValue([])
    const store = useBoardStore()

    await store.fetchBoards()

    expect(store.boards).toEqual([])
    expect(store.error).toBeNull()
  })

  it('records errors without throwing', async () => {
    api.getCollection.mockRejectedValue(new Error('network down'))
    const store = useBoardStore()

    await expect(store.fetchBoards()).resolves.toEqual([])
    expect(store.error).toBe('network down')
  })
})
