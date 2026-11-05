import { defineStore } from 'pinia'
import type { Board } from '~/types/models'
import { extractApiErrorMessage, useApi } from '~/composables/useApi'

interface BoardsState {
  boards: Board[]
  loading: boolean
  error: string | null
}

export const useBoardStore = defineStore('boards', {
  state: (): BoardsState => ({
    boards: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchBoards(): Promise<Board[]> {
      this.loading = true
      this.error = null
      try {
        this.boards = await useApi().getCollection<Board>('/boards')
      } catch (error) {
        this.error = extractApiErrorMessage(error)
      } finally {
        this.loading = false
      }
      return this.boards
    }
  }
})
