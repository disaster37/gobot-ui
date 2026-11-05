<script setup lang="ts">
import type { TfpActionName } from '~/types/models'

const boardStore = useBoardStore()
const tfpStore = useTfpStore()
const dfpStore = useDfpStore()
const tankStore = useTankStore()

async function loadPageData(): Promise<void> {
  await Promise.all([
    tfpStore.fetchAll(),
    dfpStore.fetchConfig(),
    tankStore.fetchStates(),
    boardStore.fetchBoards()
  ])
}

const { refreshNow } = useRealtimeRefresh({ onRefresh: loadPageData })

function onTfpAction(actionName: TfpActionName): void {
  void tfpStore.executeAction(actionName)
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
    <DfpAction
      :config="dfpStore.config"
      :state="dfpStore.state"
      :error="dfpStore.error"
      @refresh="refreshNow"
    />
    <TankAction v-for="tank in tankStore.states" :key="tank.id" :state="tank" />
    <p v-if="tankStore.states.length === 0">No tanks connected</p>
  </div>
</template>
