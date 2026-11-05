<script setup lang="ts">
import { computed } from 'vue'
import type { TfpActionName, TfpConfig, TfpState } from '~/types/models'
import { isBlisterOk } from '~/utils/dates'

const props = withDefaults(
  defineProps<{
    config: TfpConfig | null
    state: TfpState | null
    loading?: boolean
    error?: string | null
  }>(),
  {
    loading: false,
    error: null
  }
)

const emit = defineEmits<{
  (e: 'action', actionName: TfpActionName): void
  (e: 'refresh'): void
}>()

const secondBlisterLabel = computed(() => (props.config?.mode === 'ozone' ? 'Ozone' : 'UVC2'))

const isUVC1BlisterOk = computed(() =>
  props.config ? isBlisterOk(props.config.UVC1BlisterTime, props.config.UVC1BlisterMaxTime) : false
)
const isUVC2BlisterOk = computed(() =>
  props.config ? isBlisterOk(props.config.UVC2BlisterTime, props.config.UVC2BlisterMaxTime) : false
)
const isOzoneBlisterOk = computed(() =>
  props.config
    ? isBlisterOk(props.config.ozoneBlisterTime, props.config.ozoneBlisterMaxTime)
    : false
)

function toggle(next: boolean, on: TfpActionName, off: TfpActionName): void {
  emit('action', next ? on : off)
}
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <span>TFP control</span>
      </template>

      <UAlert
        v-if="!config || !state"
        color="neutral"
        title="No configuration available"
        description="TFP configuration and state could not be loaded."
      />

      <table v-else class="w-full">
        <tbody>
          <tr>
            <th>Pond pump</th>
            <td>
              <ButtonOnOff
                :is-on="state.pondPumpRunning"
                :loading="loading"
                @change="(next) => toggle(next, 'startPondPump', 'stopPondPump')"
              />
            </td>
          </tr>
          <template v-if="config.mode !== 'none'">
            <tr>
              <th data-test="uvc1-control">UVC1</th>
              <td>
                <ButtonOnOff
                  :is-on="state.UVC1Running"
                  :loading="loading"
                  @change="(next) => toggle(next, 'startUVC1', 'stopUVC1')"
                />
              </td>
            </tr>
            <tr>
              <th data-test="uvc2-control">{{ secondBlisterLabel }}</th>
              <td>
                <ButtonOnOff
                  :is-on="state.UVC2Running"
                  :loading="loading"
                  @change="(next) => toggle(next, 'startUVC2', 'stopUVC2')"
                />
              </td>
            </tr>
          </template>
          <tr>
            <th>Pond bubble</th>
            <td>
              <ButtonOnOff
                :is-on="state.pondBubbleRunning"
                :loading="loading"
                @change="(next) => toggle(next, 'startPondBubble', 'stopPondBubble')"
              />
            </td>
          </tr>
          <tr>
            <th>Filter bubble</th>
            <td>
              <ButtonOnOff
                :is-on="state.filterBubbleRunning"
                :loading="loading"
                @change="(next) => toggle(next, 'startFilterBubble', 'stopFilterBubble')"
              />
            </td>
          </tr>
          <tr>
            <th>Waterfall pump</th>
            <td>
              <ButtonOnOff
                :is-on="state.waterfallPumpRunning"
                :loading="loading"
                @change="(next) => toggle(next, 'startWaterfallPump', 'stopWaterfallPump')"
              />
              <UIcon
                v-if="config.isWaterfallAuto"
                :name="state.acknoledgeWaterfallAuto ? 'i-bi-alarm-fill' : 'i-bi-alarm'"
                data-test="waterfall-alarm"
              />
            </td>
          </tr>
          <tr>
            <th>UVC1 blister</th>
            <td>
              <StatusIcon size="2em" :is-ok="isUVC1BlisterOk" />
              <span>{{ state.UVC1BlisterNbHour }} hr</span>
              <UButton
                data-test="renewed-uvc1"
                size="sm"
                color="primary"
                :disabled="loading"
                @click="emit('action', 'changeUVC1Blister')"
              >
                UVC1 renewed
              </UButton>
            </td>
          </tr>
          <tr>
            <th>UVC2 blister</th>
            <td>
              <StatusIcon size="2em" :is-ok="isUVC2BlisterOk" />
              <span>{{ state.UVC2BlisterNbHour }} hr</span>
              <UButton
                data-test="renewed-uvc2"
                size="sm"
                color="primary"
                :disabled="loading"
                @click="emit('action', 'changeUVC2Blister')"
              >
                UVC2 renewed
              </UButton>
            </td>
          </tr>
          <tr>
            <th>Ozone blister</th>
            <td>
              <StatusIcon size="2em" :is-ok="isOzoneBlisterOk" />
              <span>{{ state.ozoneBlisterNbHour }} hr</span>
              <UButton
                data-test="renewed-ozone"
                size="sm"
                color="primary"
                :disabled="loading"
                @click="emit('action', 'changeOzoneBlister')"
              >
                Ozone renewed
              </UButton>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="error">
          <tr>
            <td colspan="2" class="text-error">{{ error }}</td>
          </tr>
        </tfoot>
      </table>
    </UCard>
  </div>
</template>
