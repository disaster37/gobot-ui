<script setup lang="ts">
import type { DfpConfig, TankConfig, TfpConfig } from '~/types/models'

const boardStore = useBoardStore()
const tfpStore = useTfpStore()
const dfpStore = useDfpStore()
const tankStore = useTankStore()

async function loadPageData(): Promise<void> {
  await Promise.all([
    tfpStore.fetchConfig(),
    dfpStore.fetchConfig(),
    tankStore.fetchConfigs(),
    boardStore.fetchBoards()
  ])
}

useRealtimeRefresh({ onRefresh: loadPageData })

function onDfpSaved(config: DfpConfig): void {
  void dfpStore.saveConfig(config)
}

function onTfpSaved(config: TfpConfig): void {
  void tfpStore.saveConfig(config)
}

function onTankSaved(config: TankConfig): void {
  void tankStore.saveConfig(config)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <DfpConfig :config="dfpStore.config" @saved="onDfpSaved" />
    <TfpConfig :config="tfpStore.config" @saved="onTfpSaved" />
    <TankConfig
      v-for="config in tankStore.configs"
      :key="config.id"
      :config="config"
      @saved="onTankSaved"
    />
  </div>
</template>
