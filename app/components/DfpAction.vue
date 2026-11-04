<script setup lang="ts">
import { computed } from 'vue'
import type { DfpConfig, DfpState } from '~/types/models'
import { formatDateDdMmYyyy } from '~/utils/dates'

const props = withDefaults(
  defineProps<{
    config: DfpConfig | null
    state?: DfpState | null
    error?: string | null
  }>(),
  {
    state: null,
    error: null
  }
)

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const lastWashing = computed(() =>
  props.state?.lastWashing ? formatDateDdMmYyyy(props.state.lastWashing) : '2020-01-01 10:00:00'
)
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <span>DFP control</span>
      </template>
      <table class="w-full">
        <tbody>
          <tr>
            <th>Auto</th>
            <td>
              <ButtonOnOff :is-on="true" @change="emit('refresh')" />
            </td>
          </tr>
          <tr>
            <th>Stop</th>
            <td>
              <ButtonOnOff :is-on="true" @change="emit('refresh')" />
            </td>
          </tr>
          <tr>
            <th>Status</th>
            <td>
              <DfpStatus :is-on="state ? state.isRunning : true" />
            </td>
          </tr>
          <tr>
            <th>Last washing</th>
            <td data-test="dfp-last-washing">{{ lastWashing }}</td>
          </tr>
          <tr>
            <th>Average washing time</th>
            <td>120 min</td>
          </tr>
          <tr>
            <th>Watter used</th>
            <td>120l en 24h</td>
          </tr>
        </tbody>
        <tfoot v-if="error">
          <tr>
            <td colspan="2" class="text-error" data-test="dfp-error">{{ error }}</td>
          </tr>
        </tfoot>
      </table>
    </UCard>
  </div>
</template>
