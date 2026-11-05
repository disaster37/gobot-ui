<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DfpConfig } from '~/types/models'
import { dfpConfigSchema } from '~/utils/validation'

const props = defineProps<{ config: DfpConfig | null }>()

const emit = defineEmits<{
  (e: 'saved', config: DfpConfig): void
}>()

interface DfpConfigForm {
  forceWashingDuration: string
  forceWashingDurationWhenFrozen: string
  temperatureThresholdWhenFrozen: string
  waitTimeBetweenWashing: string
  washingDuration: string
  startWashingPumpBeforeWashing: string
  waitTimeBeforeUnsetSecurity: string
  temperatureSensorPolling: string
}

const isEditing = ref(false)
const errors = ref<string[]>([])
const form = ref<DfpConfigForm>({
  forceWashingDuration: '',
  forceWashingDurationWhenFrozen: '',
  temperatureThresholdWhenFrozen: '',
  waitTimeBetweenWashing: '',
  washingDuration: '',
  startWashingPumpBeforeWashing: '',
  waitTimeBeforeUnsetSecurity: '',
  temperatureSensorPolling: ''
})

const fields: { key: keyof DfpConfigForm; label: string; help?: string }[] = [
  {
    key: 'forceWashingDuration',
    label: 'Force washing',
    help: 'Force washing from N last washing time in seconds'
  },
  {
    key: 'forceWashingDurationWhenFrozen',
    label: 'Force Washing (Frozen)',
    help: 'Force washing from N last washing time in seconds when frozen'
  },
  { key: 'temperatureThresholdWhenFrozen', label: 'Frozen temperature threshold' },
  {
    key: 'waitTimeBetweenWashing',
    label: 'Wait time between washing',
    help: 'Wait N time in seconds from last washing before can start again'
  },
  { key: 'washingDuration', label: 'Washing duration', help: 'Washing duration in seconds' },
  {
    key: 'startWashingPumpBeforeWashing',
    label: 'Start Washing pump before drum',
    help: 'Start whashing pump before drum in seconds'
  },
  {
    key: 'waitTimeBeforeUnsetSecurity',
    label: 'Wait time before unset security',
    help: 'Wait time in seconds'
  },
  {
    key: 'temperatureSensorPolling',
    label: 'Polling time to read temperature sensor',
    help: 'Polling time in seconds'
  }
]

function resetDraft(config: DfpConfig): void {
  form.value = {
    forceWashingDuration: String(config.forceWashingDuration),
    forceWashingDurationWhenFrozen: String(config.forceWashingDurationWhenFrozen),
    temperatureThresholdWhenFrozen: String(config.temperatureThresholdWhenFrozen),
    waitTimeBetweenWashing: String(config.waitTimeBetweenWashing),
    washingDuration: String(config.washingDuration),
    startWashingPumpBeforeWashing: String(config.startWashingPumpBeforeWashing),
    waitTimeBeforeUnsetSecurity: String(config.waitTimeBeforeUnsetSecurity),
    temperatureSensorPolling: String(config.temperatureSensorPolling)
  }
  errors.value = []
}

watch(
  () => props.config,
  (value) => {
    if (!isEditing.value && value) resetDraft(value)
  },
  { immediate: true }
)

function editForm(): void {
  isEditing.value = true
  errors.value = []
}

function cancelEdit(): void {
  isEditing.value = false
  if (props.config) resetDraft(props.config)
}

function save(): void {
  const parsed = dfpConfigSchema.safeParse(form.value)
  if (!parsed.success) {
    errors.value = parsed.error.issues.map((issue) => issue.message)
    return
  }
  if (!props.config) return
  emit('saved', { ...props.config, ...parsed.data })
  isEditing.value = false
}
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>DFP config</span>
          <UButton
            v-if="!isEditing"
            data-test="dfp-config-edit"
            color="neutral"
            size="sm"
            @click="editForm"
          >
            Edit
          </UButton>
          <UButton
            v-else
            data-test="dfp-config-cancel"
            color="neutral"
            size="sm"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
        </div>
      </template>

      <UAlert v-if="!config" color="neutral" title="No configuration available" />

      <UForm v-else @submit="save">
        <UFormField
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :help="field.help"
        >
          <UInput
            v-model="form[field.key]"
            :data-test="`dfp-config-${field.key}`"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>

        <UButton v-if="isEditing" data-test="dfp-config-save" type="submit" color="primary">
          Save
        </UButton>
      </UForm>

      <div v-for="(message, index) in errors" :key="index" class="text-error">{{ message }}</div>
    </UCard>
  </div>
</template>
