<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TfpState } from '~/types/models'
import { tfpStateSchema } from '~/utils/validation'

const props = defineProps<{ state: TfpState | null }>()

const emit = defineEmits<{
  (e: 'saved', state: TfpState): void
}>()

interface TfpStateForm {
  UVC1BlisterNbHour: string
  UVC2BlisterNbHour: string
  ozoneBlisterNbHour: string
}

const isEditing = ref(false)
const errors = ref<string[]>([])
const form = ref<TfpStateForm>({
  UVC1BlisterNbHour: '',
  UVC2BlisterNbHour: '',
  ozoneBlisterNbHour: ''
})

const fields: { key: keyof TfpStateForm; label: string }[] = [
  { key: 'UVC1BlisterNbHour', label: 'UVC1 Blister number hours' },
  { key: 'UVC2BlisterNbHour', label: 'UVC2 Blister number hours' },
  { key: 'ozoneBlisterNbHour', label: 'Ozone Blister number hours' }
]

function resetDraft(state: TfpState): void {
  form.value = {
    UVC1BlisterNbHour: String(state.UVC1BlisterNbHour),
    UVC2BlisterNbHour: String(state.UVC2BlisterNbHour),
    ozoneBlisterNbHour: String(state.ozoneBlisterNbHour)
  }
  errors.value = []
}

watch(
  () => props.state,
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
  if (props.state) resetDraft(props.state)
}

function save(): void {
  const parsed = tfpStateSchema.safeParse(form.value)
  if (!parsed.success) {
    errors.value = parsed.error.issues.map((issue) => issue.message)
    return
  }
  if (!props.state) return
  emit('saved', { ...props.state, ...parsed.data })
  isEditing.value = false
}
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>TFP state</span>
          <UButton
            v-if="!isEditing"
            data-test="tfp-state-edit"
            color="neutral"
            size="sm"
            @click="editForm"
          >
            Edit
          </UButton>
          <UButton
            v-else
            data-test="tfp-state-cancel"
            color="neutral"
            size="sm"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
        </div>
      </template>

      <UAlert v-if="!state" color="neutral" title="No configuration available" />

      <UForm v-else @submit="save">
        <UFormField v-for="field in fields" :key="field.key" :label="field.label">
          <UInput
            v-model="form[field.key]"
            :data-test="`tfp-state-${field.key}`"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>

        <UButton v-if="isEditing" data-test="tfp-state-save" type="submit" color="primary">
          Save
        </UButton>
      </UForm>

      <div v-for="(message, index) in errors" :key="index" class="text-error">{{ message }}</div>
    </UCard>
  </div>
</template>
