<script setup lang="ts">
import type { DfpConfig } from '~/types/models'

const boardStore = useBoardStore()
const dfpStore = useDfpStore()

async function loadPageData(): Promise<void> {
  await Promise.all([dfpStore.fetchConfig(), dfpStore.fetchState(), boardStore.fetchBoards()])
}

const { refreshNow } = useRealtimeRefresh({ onRefresh: loadPageData })

function onConfigSaved(config: DfpConfig): void {
  void dfpStore.saveConfig(config)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <DfpAction
      :config="dfpStore.config"
      :state="dfpStore.state"
      :error="dfpStore.error"
      @refresh="refreshNow"
    />
    <DfpConfig :config="dfpStore.config" @saved="onConfigSaved" />
  </div>
</template>
