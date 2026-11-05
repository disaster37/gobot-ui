<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TfpConfig } from '~/types/models'
import { formatDateDdMmYyyy, parseDateDdMmYyyy } from '~/utils/dates'
import { tfpConfigSchema } from '~/utils/validation'

const props = defineProps<{ config: TfpConfig | null }>()

const emit = defineEmits<{
  (e: 'saved', config: TfpConfig): void
}>()

interface TfpConfigForm {
  UVC1BlisterMaxTime: string
  UVC2BlisterMaxTime: string
  ozoneBlisterMaxTime: string
  mode: string
  UVC1BlisterTimeFormatted: string
  UVC2BlisterTimeFormatted: string
  ozoneBlisterTimeFormatted: string
  isWaterfallAuto: boolean
  startTimeWaterfall: string
  stopTimeWaterfall: string
}

const modes: string[] = ['UVC', 'ozone', 'none']

const isEditing = ref(false)
const errors = ref<string[]>([])
const form = ref<TfpConfigForm>({
  UVC1BlisterMaxTime: '',
  UVC2BlisterMaxTime: '',
  ozoneBlisterMaxTime: '',
  mode: 'none',
  UVC1BlisterTimeFormatted: '',
  UVC2BlisterTimeFormatted: '',
  ozoneBlisterTimeFormatted: '',
  isWaterfallAuto: false,
  startTimeWaterfall: '',
  stopTimeWaterfall: ''
})

function resetDraft(config: TfpConfig): void {
  form.value = {
    UVC1BlisterMaxTime: String(config.UVC1BlisterMaxTime),
    UVC2BlisterMaxTime: String(config.UVC2BlisterMaxTime),
    ozoneBlisterMaxTime: String(config.ozoneBlisterMaxTime),
    mode: config.mode,
    UVC1BlisterTimeFormatted: formatDateDdMmYyyy(config.UVC1BlisterTime),
    UVC2BlisterTimeFormatted: formatDateDdMmYyyy(config.UVC2BlisterTime),
    ozoneBlisterTimeFormatted: formatDateDdMmYyyy(config.ozoneBlisterTime),
    isWaterfallAuto: config.isWaterfallAuto,
    startTimeWaterfall: config.startTimeWaterfall,
    stopTimeWaterfall: config.stopTimeWaterfall
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
  const parsed = tfpConfigSchema.safeParse(form.value)
  if (!parsed.success) {
    errors.value = parsed.error.issues.map((issue) => issue.message)
    return
  }
  if (!props.config) return
  const data = parsed.data
  emit('saved', {
    ...props.config,
    UVC1BlisterMaxTime: data.UVC1BlisterMaxTime,
    UVC2BlisterMaxTime: data.UVC2BlisterMaxTime,
    ozoneBlisterMaxTime: data.ozoneBlisterMaxTime,
    mode: data.mode,
    UVC1BlisterTime: parseDateDdMmYyyy(data.UVC1BlisterTimeFormatted),
    UVC2BlisterTime: parseDateDdMmYyyy(data.UVC2BlisterTimeFormatted),
    ozoneBlisterTime: parseDateDdMmYyyy(data.ozoneBlisterTimeFormatted),
    isWaterfallAuto: data.isWaterfallAuto,
    startTimeWaterfall: data.startTimeWaterfall,
    stopTimeWaterfall: data.stopTimeWaterfall
  })
  isEditing.value = false
}
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>TFP config</span>
          <UButton
            v-if="!isEditing"
            data-test="tfp-config-edit"
            color="neutral"
            size="sm"
            @click="editForm"
          >
            Edit
          </UButton>
          <UButton
            v-else
            data-test="tfp-config-cancel"
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
        <UFormField label="UVC1 Blister max time">
          <UInput
            v-model="form.UVC1BlisterMaxTime"
            data-test="tfp-config-UVC1BlisterMaxTime"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="UVC2 Blister max time">
          <UInput
            v-model="form.UVC2BlisterMaxTime"
            data-test="tfp-config-UVC2BlisterMaxTime"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="Ozone Blister max time">
          <UInput
            v-model="form.ozoneBlisterMaxTime"
            data-test="tfp-config-ozoneBlisterMaxTime"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="Mode">
          <USelect
            v-model="form.mode"
            data-test="tfp-config-mode"
            :items="modes"
            :disabled="!isEditing"
          />
        </UFormField>
        <UFormField
          label="UVC1 Blister time"
          help="Date when blister has been changed (just user info)"
        >
          <UInput
            v-model="form.UVC1BlisterTimeFormatted"
            data-test="tfp-config-UVC1BlisterTime"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField
          label="UVC2 Blister time"
          help="Date when blister has been changed (just user info)"
        >
          <UInput
            v-model="form.UVC2BlisterTimeFormatted"
            data-test="tfp-config-UVC2BlisterTime"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField
          label="Ozone Blister time"
          help="Date when blister has been changed (just user info)"
        >
          <UInput
            v-model="form.ozoneBlisterTimeFormatted"
            data-test="tfp-config-ozoneBlisterTime"
            :readonly="!isEditing"
          />
        </UFormField>
        <UCheckbox
          v-model="form.isWaterfallAuto"
          data-test="tfp-config-isWaterfallAuto"
          label="Waterfall auto"
          :disabled="!isEditing"
        />
        <UFormField label="Start time waterfall">
          <UInput
            v-model="form.startTimeWaterfall"
            data-test="tfp-config-startTimeWaterfall"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="Stop time waterfall">
          <UInput
            v-model="form.stopTimeWaterfall"
            data-test="tfp-config-stopTimeWaterfall"
            :readonly="!isEditing"
          />
        </UFormField>

        <UButton v-if="isEditing" data-test="tfp-config-save" type="submit" color="primary">
          Save
        </UButton>
      </UForm>

      <div v-for="(message, index) in errors" :key="index" class="text-error">{{ message }}</div>
    </UCard>
  </div>
</template>
