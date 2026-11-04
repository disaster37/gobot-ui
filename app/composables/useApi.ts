import type {
  JsonApiCollectionDocument,
  JsonApiDocument,
  JsonApiErrorResponse,
  JsonApiResourceType
} from '~/types/api'
import type { TfpActionName } from '~/types/models'
import { deserializeCollection, deserializeSingle, serializeResource } from '~/utils/jsonapi'
import { useAuthStore } from '~/stores/auth'

export const TFP_ACTION_ENDPOINTS: Record<TfpActionName, string> = {
  startWaterfallPump: '/tfps/action/start_waterfall_pump',
  stopWaterfallPump: '/tfps/action/stop_waterfall_pump',
  startPondPump: '/tfps/action/start_pond_pump',
  stopPondPump: '/tfps/action/stop_pond_pump',
  startUVC1: '/tfps/action/start_uvc1',
  stopUVC1: '/tfps/action/stop_uvc1',
  startUVC2: '/tfps/action/start_uvc2',
  stopUVC2: '/tfps/action/stop_uvc2',
  startPondBubble: '/tfps/action/start_pond_bubble',
  stopPondBubble: '/tfps/action/stop_pond_bubble',
  startFilterBubble: '/tfps/action/start_filter_bubble',
  stopFilterBubble: '/tfps/action/stop_filter_bubble',
  changeUVC1Blister: '/tfps/action/change_uvc1_blister',
  changeUVC2Blister: '/tfps/action/change_uvc2_blister',
  changeOzoneBlister: '/tfps/action/change_ozone_blister'
}

export interface ApiClient {
  getCollection<T extends { id: string }>(
    path: string,
    fieldMap?: Record<string, keyof T>
  ): Promise<T[]>
  patchResource<T extends { id: string }>(
    path: string,
    type: JsonApiResourceType,
    model: T
  ): Promise<T>
  postAction(path: string): Promise<string>
}

interface FetchErrorLike {
  data?: unknown
  message?: string
}

/**
 * Normalises every error shape the backend can return (JSON:API errors, plain
 * text bodies, or generic `Error` objects) into a single human readable string.
 */
export function extractApiErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    const { data, message } = error as FetchErrorLike

    if (typeof data === 'string' && data.length > 0) return data

    if (data && typeof data === 'object') {
      const { errors } = data as JsonApiErrorResponse
      if (Array.isArray(errors) && errors.length > 0) {
        const first = errors[0]
        return first?.message ?? first?.detail ?? first?.title ?? 'An unexpected error occurred'
      }
      const nestedMessage = (data as { message?: unknown }).message
      if (typeof nestedMessage === 'string' && nestedMessage.length > 0) return nestedMessage
    }

    if (typeof message === 'string' && message.length > 0) return message
  }

  return String(error)
}

export function useApi(): ApiClient {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const baseURL = config.public.apiBase as string

  const client = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers)
      headers.set('Accept', 'application/vnd.api+json, application/json, text/plain, */*')
      if (authStore.token) {
        headers.set('Authorization', `Bearer ${authStore.token}`)
      }
      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
    }
  })

  return {
    async getCollection<T extends { id: string }>(
      path: string,
      fieldMap?: Record<string, keyof T>
    ): Promise<T[]> {
      const doc = await client<JsonApiCollectionDocument>(path, { method: 'GET' })
      return deserializeCollection<T>(doc, fieldMap)
    },

    async patchResource<T extends { id: string }>(
      path: string,
      type: JsonApiResourceType,
      model: T
    ): Promise<T> {
      const doc = await client<JsonApiDocument>(path, {
        method: 'PATCH',
        body: serializeResource(type, model),
        headers: { 'Content-Type': 'application/vnd.api+json' }
      })
      return deserializeSingle<T>(doc) as T
    },

    async postAction(path: string): Promise<string> {
      // The backend answers /tfps/action/* with json, text and text/xml
      // indifferently; reading everything as text avoids bogus JSON parse errors.
      const response = await client<string>(path, { method: 'POST', responseType: 'text' })
      return typeof response === 'string' ? response : ''
    }
  }
}
