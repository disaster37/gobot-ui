import { defineStore } from 'pinia'
import type { TankConfig, TankState } from '~/types/models'
import { extractApiErrorMessage, useApi } from '~/composables/useApi'

interface TanksStoreState {
  states: TankState[]
  configs: TankConfig[]
  loading: boolean
  error: string | null
}

interface FetchOptions {
  /** When true, a failed sibling fetch cannot be clobbered by clearing the error at start. */
  preserveError?: boolean
}

export const useTankStore = defineStore('tanks', {
  state: (): TanksStoreState => ({
    states: [],
    configs: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchStates(options: FetchOptions = {}): Promise<TankState[]> {
      if (!options.preserveError) this.error = null
      try {
        this.states = await useApi().getCollection<TankState>('/tanks')
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.states
    },

    async fetchConfigs(options: FetchOptions = {}): Promise<TankConfig[]> {
      if (!options.preserveError) this.error = null
      try {
        this.configs = await useApi().getCollection<TankConfig>('/tank-configs')
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.configs
    },

    async fetchAll(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        await Promise.all([
          this.fetchConfigs({ preserveError: true }),
          this.fetchStates({ preserveError: true })
        ])
      } finally {
        this.loading = false
      }
    },

    async saveConfig(updated: TankConfig): Promise<TankConfig> {
      this.error = null
      try {
        const saved = await useApi().patchResource(
          `/tank-configs/${updated.id}`,
          'tank-configs',
          updated
        )
        this.configs = this.configs.map((config) => (config.id === saved.id ? saved : config))
        return saved
      } catch (error) {
        this.error = extractApiErrorMessage(error)
        throw error
      }
    }
  }
})
