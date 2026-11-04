import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { extractApiErrorMessage, TFP_ACTION_ENDPOINTS, useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { boardsPayload, dfpConfigPayload } from '../../fixtures/jsonapi'

const request = vi.fn()
let createOptions: {
  onRequest: (ctx: { options: { headers?: HeadersInit } }) => void
  onResponseError: (ctx: { response: { status: number } }) => Promise<void> | void
}

beforeEach(() => {
  request.mockReset()
  createOptions = undefined as never
  ;(globalThis as Record<string, unknown>).$fetch = Object.assign(vi.fn(), {
    create: vi.fn((options: typeof createOptions) => {
      createOptions = options
      return request
    })
  })
  ;(globalThis as Record<string, unknown>).navigateTo = vi.fn()
  setActivePinia(createPinia())
})

describe('useApi request interceptor', () => {
  it('attaches the bearer token when authenticated', () => {
    useAuthStore().token = 'my-token'
    useApi()
    const options: { headers?: HeadersInit } = {}
    createOptions.onRequest({ options })
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer my-token')
    expect(new Headers(options.headers).get('Accept')).toContain('application/vnd.api+json')
  })

  it('omits the authorization header when unauthenticated', () => {
    useApi()
    const options: { headers?: HeadersInit } = {}
    createOptions.onRequest({ options })
    expect(new Headers(options.headers).get('Authorization')).toBeNull()
  })

  it('logs out (which redirects) on 401 responses without navigating twice', async () => {
    const authStore = useAuthStore()
    authStore.token = 'expired'
    const logout = vi.spyOn(authStore, 'logout')
    useApi()
    await createOptions.onResponseError({ response: { status: 401 } })
    expect(logout).toHaveBeenCalledTimes(1)
    expect(authStore.token).toBeNull()
    expect((globalThis as Record<string, unknown>).navigateTo).toHaveBeenCalledTimes(1)
    expect((globalThis as Record<string, unknown>).navigateTo).toHaveBeenCalledWith('/login')
  })

  it('ignores non-401 responses', async () => {
    const authStore = useAuthStore()
    const logout = vi.spyOn(authStore, 'logout').mockResolvedValue()
    useApi()
    await createOptions.onResponseError({ response: { status: 500 } })
    expect(logout).not.toHaveBeenCalled()
  })
})

describe('useApi methods', () => {
  it('getCollection deserializes JSON:API collections', async () => {
    request.mockResolvedValue(boardsPayload)
    const boards = await useApi().getCollection('/boards')
    expect(request).toHaveBeenCalledWith('/boards', { method: 'GET' })
    expect(boards[0]).toMatchObject({ id: 'dfp', isOnline: true })
  })

  it('patchResource serializes the model and deserializes the response', async () => {
    request.mockResolvedValue(dfpConfigPayload)
    const model = {
      id: '1',
      forceWashingDuration: 3600,
      createdAt: null,
      updatedAt: null,
      version: 1
    }
    const result = await useApi().patchResource('/dfp-configs/1', 'dfp-configs', model)
    const [, options] = request.mock.calls[0] as [
      string,
      { body: { data: { attributes: Record<string, unknown> } } }
    ]
    expect(options.body.data.attributes.force_washing_duration).toBe(3600)
    expect(options.body.data.attributes).not.toHaveProperty('created_at')
    expect(result.id).toBe('1')
  })

  it('postAction returns text responses and tolerates empty bodies', async () => {
    request.mockResolvedValue('OK')
    expect(await useApi().postAction(TFP_ACTION_ENDPOINTS.startPondPump)).toBe('OK')
    request.mockResolvedValue(undefined)
    expect(await useApi().postAction(TFP_ACTION_ENDPOINTS.stopPondPump)).toBe('')
  })
})

describe('extractApiErrorMessage', () => {
  it('reads JSON:API message and detail errors', () => {
    expect(extractApiErrorMessage({ data: { errors: [{ message: 'Bad request' }] } })).toBe(
      'Bad request'
    )
    expect(extractApiErrorMessage({ data: { errors: [{ detail: 'Not found' }] } })).toBe(
      'Not found'
    )
  })

  it('reads plain text and generic error messages', () => {
    expect(extractApiErrorMessage({ data: 'Boom' })).toBe('Boom')
    expect(extractApiErrorMessage(new Error('Oops'))).toBe('Oops')
    expect(extractApiErrorMessage('raw')).toBe('raw')
  })

  it('falls back to a generic message', () => {
    expect(extractApiErrorMessage({ data: { errors: [{}] } })).toBe('An unexpected error occurred')
  })
})
