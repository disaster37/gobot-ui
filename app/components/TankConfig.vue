<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TankConfig } from '~/types/models'
import { tankConfigSchema } from '~/utils/validation'

const props = defineProps<{ config: TankConfig }>()

const emit = defineEmits<{
  (e: 'saved', config: TankConfig): void
}>()

interface TankConfigForm {
  name: string
  depth: string
  sensorHeight: string
  literPerCm: string
}

const isEditing = ref(false)
const errors = ref<string[]>([])
const form = ref<TankConfigForm>({
  name: '',
  depth: '',
  sensorHeight: '',
  literPerCm: ''
})

function resetDraft(config: TankConfig): void {
  form.value = {
    name: config.name,
    depth: String(config.depth),
    sensorHeight: String(config.sensorHeight),
    literPerCm: String(config.literPerCm)
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
  resetDraft(props.config)
}

function save(): void {
  const parsed = tankConfigSchema.safeParse(form.value)
  if (!parsed.success) {
    errors.value = parsed.error.issues.map((issue) => issue.message)
    return
  }
  emit('saved', { ...props.config, ...parsed.data })
  isEditing.value = false
}
</script>

<template>
  <div class="col-sm">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ config.name }} config</span>
          <UButton
            v-if="!isEditing"
            data-test="tank-config-edit"
            color="neutral"
            size="sm"
            @click="editForm"
          >
            Edit
          </UButton>
          <UButton
            v-else
            data-test="tank-config-cancel"
            color="neutral"
            size="sm"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
        </div>
      </template>

      <UForm @submit="save">
        <UFormField label="Name">
          <UInput v-model="form.name" data-test="tank-config-name" :readonly="!isEditing" />
        </UFormField>
        <UFormField label="Depth (cm)">
          <UInput
            v-model="form.depth"
            data-test="tank-config-depth"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="Sensor Height (cm)">
          <UInput
            v-model="form.sensorHeight"
            data-test="tank-config-sensorHeight"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>
        <UFormField label="Liter per cm">
          <UInput
            v-model="form.literPerCm"
            data-test="tank-config-literPerCm"
            type="number"
            :readonly="!isEditing"
          />
        </UFormField>

        <UButton v-if="isEditing" data-test="tank-config-save" type="submit" color="primary">
          Save
        </UButton>
      </UForm>

      <div v-for="(message, index) in errors" :key="index" class="text-error">{{ message }}</div>
    </UCard>
  </div>
</template>
