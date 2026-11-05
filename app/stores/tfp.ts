import { defineStore } from 'pinia'
import type { TfpActionName, TfpConfig, TfpState } from '~/types/models'
import { extractApiErrorMessage, TFP_ACTION_ENDPOINTS, useApi } from '~/composables/useApi'
import { isBlisterOk } from '~/utils/dates'
import { pickSingleton } from '~/utils/jsonapi'

interface TfpStoreState {
  config: TfpConfig | null
  state: TfpState | null
  loading: boolean
  actionLoading: Partial<Record<TfpActionName, boolean>>
  error: string | null
}

interface FetchOptions {
  /** When true, a failed sibling fetch cannot be clobbered by clearing the error at start. */
  preserveError?: boolean
}

export const useTfpStore = defineStore('tfp', {
  state: (): TfpStoreState => ({
    config: null,
    state: null,
    loading: false,
    actionLoading: {},
    error: null
  }),

  getters: {
    isAnyActionLoading: (state): boolean => Object.values(state.actionLoading).some(Boolean),
    isUVC1BlisterOk: (state): boolean =>
      state.config
        ? isBlisterOk(state.config.UVC1BlisterTime, state.config.UVC1BlisterMaxTime)
        : false,
    isUVC2BlisterOk: (state): boolean =>
      state.config
        ? isBlisterOk(state.config.UVC2BlisterTime, state.config.UVC2BlisterMaxTime)
        : false,
    isOzoneBlisterOk: (state): boolean =>
      state.config
        ? isBlisterOk(state.config.ozoneBlisterTime, state.config.ozoneBlisterMaxTime)
        : false
  },

  actions: {
    async fetchConfig(options: FetchOptions = {}): Promise<TfpConfig | null> {
      if (!options.preserveError) this.error = null
      try {
        this.config = pickSingleton(await useApi().getCollection<TfpConfig>('/tfp-configs'))
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.config
    },

    async fetchState(options: FetchOptions = {}): Promise<TfpState | null> {
      if (!options.preserveError) this.error = null
      try {
        this.state = pickSingleton(await useApi().getCollection<TfpState>('/tfp-states'))
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.state
    },

    async fetchAll(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        // `preserveError` keeps a failed half from being wiped by a sibling that
        // succeeds (or vice versa); whatever succeeded is still committed.
        await Promise.all([
          this.fetchConfig({ preserveError: true }),
          this.fetchState({ preserveError: true })
        ])
      } finally {
        this.loading = false
      }
    },

    async saveConfig(updated: TfpConfig): Promise<TfpConfig> {
      this.error = null
      try {
        this.config = await useApi().patchResource(
          `/tfp-configs/${updated.id}`,
          'tfp-configs',
          updated
        )
      } catch (error) {
        this.error = extractApiErrorMessage(error)
        throw error
      }
      return this.config
    },

    async saveState(updated: TfpState): Promise<TfpState> {
      this.error = null
      try {
        this.state = await useApi().patchResource(
          `/tfp-states/${updated.id}`,
          'tfp-states',
          updated
        )
      } catch (error) {
        this.error = extractApiErrorMessage(error)
        throw error
      }
      return this.state
    },

    async executeAction(actionName: TfpActionName): Promise<void> {
      if (this.actionLoading[actionName]) return
      this.actionLoading[actionName] = true
      this.error = null
      try {
        await useApi().postAction(TFP_ACTION_ENDPOINTS[actionName])
        await this.fetchAll()
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      } finally {
        this.actionLoading[actionName] = false
      }
    }
  }
})
