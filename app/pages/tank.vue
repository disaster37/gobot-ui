<script setup lang="ts">
import type { TankConfig } from '~/types/models'

const boardStore = useBoardStore()
const tankStore = useTankStore()

async function loadPageData(): Promise<void> {
  await Promise.all([tankStore.fetchAll(), boardStore.fetchBoards()])
}

useRealtimeRefresh({ onRefresh: loadPageData })

function onConfigSaved(config: TankConfig): void {
  void tankStore.saveConfig(config)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <TankConfig
      v-for="config in tankStore.configs"
      :key="config.id"
      :config="config"
      @saved="onConfigSaved"
    />
    <p v-if="tankStore.configs.length === 0">No tank configuration available</p>
    <TankAction v-for="tank in tankStore.states" :key="tank.id" :state="tank" />
    <p v-if="tankStore.states.length === 0">No tanks connected</p>
  </div>
</template>
