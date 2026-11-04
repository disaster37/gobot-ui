import { describe, expect, it } from 'vitest'
import {
  camelize,
  decamelize,
  deserializeCollection,
  deserializeResource,
  deserializeSingle,
  pickSingleton,
  serializeResource
} from '~/utils/jsonapi'
import type { TfpConfig, TfpState } from '~/types/models'
import { emptyCollection, tfpConfigPayload, tfpStatePayload } from '../../fixtures/jsonapi'

describe('decamelize', () => {
  it('converts standard camelCase', () => {
    expect(decamelize('isWaterfallAuto')).toBe('is_waterfall_auto')
    expect(decamelize('acknoledgeWaterfallAuto')).toBe('acknoledge_waterfall_auto')
  })

  it('converts uppercase acronyms without splitting digits', () => {
    expect(decamelize('UVC1BlisterMaxTime')).toBe('uvc1_blister_max_time')
    expect(decamelize('UVC1Running')).toBe('uvc1_running')
    expect(decamelize('BacteriumTime')).toBe('bacterium_time')
  })
})

describe('camelize', () => {
  it('converts snake_case back to camelCase', () => {
    expect(camelize('is_waterfall_auto')).toBe('isWaterfallAuto')
    expect(camelize('uvc1_blister_nb_hour')).toBe('uvc1BlisterNbHour')
  })
})

describe('deserializeResource', () => {
  it('maps explicit and standard attributes for tfp-configs', () => {
    const config = deserializeResource<TfpConfig>(tfpConfigPayload.data)
    expect(config.UVC1BlisterMaxTime).toBe(8000)
    expect(config.UVC2BlisterMaxTime).toBe(8000)
    expect(config.UVC1BlisterTime).toBe('2025-06-01T00:00:00Z')
    expect(config.ozoneBlisterMaxTime).toBe(5000)
    expect(config.isWaterfallAuto).toBe(true)
    expect(config.mode).toBe('UVC')
    expect(config.createdAt).toBe('2025-01-01T10:00:00Z')
  })

  it('preserves the acknoledge typo and BacteriumTime casing for tfp-states', () => {
    const state = deserializeResource<TfpState>(tfpStatePayload.data)
    expect(state.acknoledgeWaterfallAuto).toBe(true)
    expect(state.BacteriumTime).toBe('2026-01-01T00:00:00Z')
    expect(state.UVC1Running).toBe(true)
    expect(state.UVC1BlisterNbHour).toBe(1200)
    expect(state.filterBubbleRunning).toBe(false)
  })
})

describe('pickSingleton', () => {
  it('prefers record id 1, then the first item, then null', () => {
    expect(pickSingleton([{ id: '2' }, { id: '1' }])?.id).toBe('1')
    expect(pickSingleton([{ id: '2' }])?.id).toBe('2')
    expect(pickSingleton([])).toBeNull()
  })
})

describe('deserializeCollection', () => {
  it('deserializes every resource', () => {
    const board = deserializeCollection<{ id: string; isOnline: boolean }>({
      data: [{ id: 'dfp', type: 'boards', attributes: { is_online: true } }]
    })
    expect(board).toEqual([{ id: 'dfp', isOnline: true }])
  })

  it('returns an empty array for empty collections', () => {
    expect(deserializeCollection(emptyCollection)).toEqual([])
  })
})

describe('deserializeSingle', () => {
  it('selects the requested id', () => {
    const config = deserializeSingle<TfpConfig>(tfpConfigPayload, '1')
    expect(config?.id).toBe('1')
  })

  it('falls back to the first record when id is missing', () => {
    const config = deserializeSingle<TfpConfig>(tfpConfigPayload)
    expect(config?.id).toBe('1')
  })

  it('returns null for empty collections and mismatched ids', () => {
    expect(deserializeSingle(emptyCollection, '1')).toBeNull()
    expect(deserializeSingle<TfpConfig>(tfpConfigPayload, '42')).toBeNull()
  })

  it('accepts a single document envelope', () => {
    expect(deserializeSingle<TfpConfig>(tfpConfigPayload)?.id).toBe('1')
  })
})

describe('serializeResource', () => {
  const model: TfpConfig = {
    id: '1',
    UVC1BlisterMaxTime: 8000,
    UVC2BlisterMaxTime: 8000,
    ozoneBlisterMaxTime: 5000,
    isWaterfallAuto: true,
    startTimeWaterfall: '08:00',
    stopTimeWaterfall: '20:00',
    mode: 'UVC',
    UVC1BlisterTime: '2025-06-01T00:00:00.000Z',
    UVC2BlisterTime: null,
    ozoneBlisterTime: null,
    updatedAt: '2026-01-01T10:00:00Z',
    createdAt: '2025-01-01T10:00:00Z',
    version: 4
  }

  it('produces a JSON:API envelope with snake_case attributes', () => {
    const doc = serializeResource('tfp-configs', model)
    expect(doc.data.type).toBe('tfp-configs')
    expect(doc.data.id).toBe('1')
    expect(doc.data.attributes.uvc1_blister_max_time).toBe(8000)
    expect(doc.data.attributes.uvc1_blister_time).toBe('2025-06-01T00:00:00.000Z')
    expect(doc.data.attributes.is_waterfall_auto).toBe(true)
    expect(doc.data.attributes.version).toBe(4)
  })

  it('omits id, createdAt and updatedAt', () => {
    const doc = serializeResource('tfp-configs', model)
    expect(doc.data.attributes).not.toHaveProperty('id')
    expect(doc.data.attributes).not.toHaveProperty('createdAt')
    expect(doc.data.attributes).not.toHaveProperty('updatedAt')
    expect(doc.data.attributes).not.toHaveProperty('created_at')
    expect(doc.data.attributes).not.toHaveProperty('updated_at')
  })

  it('honours additional excluded fields', () => {
    const doc = serializeResource('tfp-configs', model, ['mode'])
    expect(doc.data.attributes).not.toHaveProperty('mode')
  })
})
