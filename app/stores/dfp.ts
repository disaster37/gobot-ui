import { defineStore } from 'pinia'
import type { DfpConfig, DfpState } from '~/types/models'
import { extractApiErrorMessage, useApi } from '~/composables/useApi'
import { pickSingleton } from '~/utils/jsonapi'

interface DfpStoreState {
  config: DfpConfig | null
  state: DfpState | null
  loading: boolean
  error: string | null
}

export const useDfpStore = defineStore('dfp', {
  state: (): DfpStoreState => ({
    config: null,
    state: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchConfig(): Promise<DfpConfig | null> {
      this.error = null
      try {
        this.config = pickSingleton(await useApi().getCollection<DfpConfig>('/dfp-configs'))
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.config
    },

    async fetchState(): Promise<DfpState | null> {
      this.error = null
      try {
        this.state = pickSingleton(await useApi().getCollection<DfpState>('/dfp-states'))
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.state
    },

    async saveConfig(updated: DfpConfig): Promise<DfpConfig> {
      this.error = null
      try {
        this.config = await useApi().patchResource(
          `/dfp-configs/${updated.id}`,
          'dfp-configs',
          updated
        )
      } catch (error) {
        this.error = extractApiErrorMessage(error)
        throw error
      }
      return this.config
    }
  }
})
