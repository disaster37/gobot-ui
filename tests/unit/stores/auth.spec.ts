import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AUTH_TOKEN_KEY, isJwtExpired, LEGACY_AUTH_TOKEN_KEY, useAuthStore } from '~/stores/auth'

function makeJwt(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

const futureToken = () => makeJwt({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })
const expiredToken = () => makeJwt({ sub: 'admin', exp: Math.floor(Date.now() / 1000) - 3600 })

beforeEach(() => {
  localStorage.clear()
  ;(globalThis as Record<string, unknown>).$fetch = vi.fn()
  ;(globalThis as Record<string, unknown>).navigateTo = vi.fn()
  setActivePinia(createPinia())
})

describe('isJwtExpired', () => {
  it('detects expired and valid tokens', () => {
    expect(isJwtExpired(expiredToken())).toBe(true)
    expect(isJwtExpired(futureToken())).toBe(false)
  })

  it('treats tokens without exp or malformed tokens as not expired', () => {
    expect(isJwtExpired(makeJwt({ sub: 'x' }))).toBe(false)
    expect(isJwtExpired('not-a-jwt')).toBe(false)
  })
})

describe('auth store login', () => {
  it('stores the token and authenticates on success', async () => {
    const token = futureToken()
    ;(globalThis.$fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ token })
    const store = useAuthStore()

    const ok = await store.login({ username: 'admin', password: 'secret' })

    expect(ok).toBe(true)
    expect(store.token).toBe(token)
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
  })

  it('shows a friendly message on 401', async () => {
    ;(globalThis.$fetch as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { status: 401 }
    })
    const store = useAuthStore()

    const ok = await store.login({ username: 'admin', password: 'wrong' })

    expect(ok).toBe(false)
    expect(store.error).toBe('Incorrect username or password')
    expect(store.token).toBeNull()
  })

  it('parses JSON:API error payloads without throwing', async () => {
    ;(globalThis.$fetch as ReturnType<typeof vi.fn>).mockRejectedValue({
      data: { errors: [{ message: 'Server exploded' }] }
    })
    const store = useAuthStore()

    await expect(store.login({ username: 'a', password: 'b' })).resolves.toBe(false)
    expect(store.error).toBe('Server exploded')
  })
})

describe('auth store hydrate', () => {
  it('restores the token from localStorage', () => {
    const token = futureToken()
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    const store = useAuthStore()

    store.hydrate()

    expect(store.token).toBe(token)
    expect(store.isAuthenticated).toBe(true)
  })

  it('migrates the legacy ember_simple_auth-session token', () => {
    const token = futureToken()
    localStorage.setItem(LEGACY_AUTH_TOKEN_KEY, JSON.stringify({ authenticated: { token } }))
    const store = useAuthStore()

    store.hydrate()

    expect(store.token).toBe(token)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(localStorage.getItem(LEGACY_AUTH_TOKEN_KEY)).toBeNull()
  })

  it('clears expired tokens', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, expiredToken())
    const store = useAuthStore()

    store.hydrate()

    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('is idempotent when a token is already set', () => {
    const store = useAuthStore()
    store.token = futureToken()
    store.hydrate()
    expect(store.token).not.toBeNull()
  })
})

describe('auth store logout', () => {
  it('clears state and storage and redirects to login', async () => {
    const store = useAuthStore()
    store.token = futureToken()
    localStorage.setItem(AUTH_TOKEN_KEY, store.token)

    await store.logout()

    expect(store.token).toBeNull()
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect((globalThis as Record<string, unknown>).navigateTo).toHaveBeenCalledWith('/login')
  })
})
