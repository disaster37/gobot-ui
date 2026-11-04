<script setup lang="ts">
import type { TfpActionName, TfpConfig, TfpState } from '~/types/models'

const boardStore = useBoardStore()
const tfpStore = useTfpStore()

async function loadPageData(): Promise<void> {
  await Promise.all([tfpStore.fetchAll(), boardStore.fetchBoards()])
}

const { refreshNow } = useRealtimeRefresh({ onRefresh: loadPageData })

function onTfpAction(actionName: TfpActionName): void {
  void tfpStore.executeAction(actionName)
}

function onConfigSaved(config: TfpConfig): void {
  void tfpStore.saveConfig(config)
}

function onStateSaved(state: TfpState): void {
  void tfpStore.saveState(state)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <TfpAction
      :config="tfpStore.config"
      :state="tfpStore.state"
      :loading="tfpStore.loading || tfpStore.isAnyActionLoading"
      :error="tfpStore.error"
      @action="onTfpAction"
      @refresh="refreshNow"
    />
    <TfpConfig :config="tfpStore.config" @saved="onConfigSaved" />
    <TfpState :state="tfpStore.state" @saved="onStateSaved" />
  </div>
</template>
