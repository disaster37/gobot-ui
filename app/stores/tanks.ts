import { defineStore } from 'pinia'
import type { TankConfig, TankState } from '~/types/models'
import { extractApiErrorMessage, useApi } from '~/composables/useApi'

interface TanksStoreState {
  states: TankState[]
  configs: TankConfig[]
  loading: boolean
  error: string | null
}

export const useTankStore = defineStore('tanks', {
  state: (): TanksStoreState => ({
    states: [],
    configs: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchStates(): Promise<TankState[]> {
      this.error = null
      try {
        this.states = await useApi().getCollection<TankState>('/tanks')
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.states
    },

    async fetchConfigs(): Promise<TankConfig[]> {
      this.error = null
      try {
        this.configs = await useApi().getCollection<TankConfig>('/tank-configs')
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      }
      return this.configs
    },

    async fetchAll(): Promise<void> {
      this.loading = true
      try {
        await Promise.all([this.fetchConfigs(), this.fetchStates()])
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
