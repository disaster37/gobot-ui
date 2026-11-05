<script setup lang="ts">
import type { TankState } from '~/types/models'

defineProps<{ state: TankState }>()
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <span>{{ state.id }} state</span>
      </template>
      <div class="space-y-2">
        <UFormField label="Level">
          <UInput :model-value="state.level" readonly data-test="tank-level" />
        </UFormField>
        <UFormField label="Volume">
          <UInput :model-value="state.volume" readonly data-test="tank-volume" />
        </UFormField>
        <UFormField label="Percent">
          <UInput :model-value="state.percent" readonly data-test="tank-percent" />
        </UFormField>
        <UFormField label="Distance">
          <UInput :model-value="state.distance" readonly data-test="tank-distance" />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
