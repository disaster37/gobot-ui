import { defineStore } from 'pinia'
import type { LoginRequest, LoginResponse } from '~/types/api'
import { extractApiErrorMessage } from '~/composables/useApi'

export const AUTH_TOKEN_KEY = 'dfp_auth_token'
export const LEGACY_AUTH_TOKEN_KEY = 'ember_simple_auth-session'

// Security note (tracked for a future PR): the JWT is persisted in
// `localStorage`, which is readable by any script running on the origin. This
// is deliberately unchanged from the previous Ember app for backend
// compatibility. Moving to an httpOnly, Secure cookie set by the backend
// (CWE-522 mitigation) requires backend support and is out of scope here; do
// not weaken this further (e.g. never log the token).

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = (parts[1] ?? '').replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as Record<string, unknown>
  } catch {
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const exp = payload.exp
  if (typeof exp !== 'number') return false
  return exp * 1000 <= Date.now()
}

function storage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    return null
  }
}

function readLegacyToken(): string | null {
  const store = storage()
  if (!store) return null
  const raw = store.getItem(LEGACY_AUTH_TOKEN_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { authenticated?: { token?: string } }
    return parsed.authenticated?.token ?? null
  } catch {
    return null
  }
}

function loginErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status
  if (status === 401) return 'Incorrect username or password'
  return extractApiErrorMessage(error)
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.token && !isJwtExpired(state.token))
  },

  actions: {
    hydrate(): void {
      if (this.token) return
      const store = storage()
      const token = store?.getItem(AUTH_TOKEN_KEY) ?? readLegacyToken()
      if (!token) return
      if (isJwtExpired(token)) {
        store?.removeItem(AUTH_TOKEN_KEY)
        store?.removeItem(LEGACY_AUTH_TOKEN_KEY)
        return
      }
      this.token = token
      store?.setItem(AUTH_TOKEN_KEY, token)
      store?.removeItem(LEGACY_AUTH_TOKEN_KEY)
    },

    async login(credentials: LoginRequest): Promise<boolean> {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()
      try {
        const response = await $fetch<LoginResponse>(config.public.authEndpoint as string, {
          method: 'POST',
          body: credentials
        })
        this.token = response.token
        storage()?.setItem(AUTH_TOKEN_KEY, response.token)
        return true
      } catch (error) {
        this.token = null
        this.error = loginErrorMessage(error)
        return false
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<void> {
      this.token = null
      this.error = null
      const store = storage()
      store?.removeItem(AUTH_TOKEN_KEY)
      store?.removeItem(LEGACY_AUTH_TOKEN_KEY)
      navigateTo('/login')
    }
  }
})
