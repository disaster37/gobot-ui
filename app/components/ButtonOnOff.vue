<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOn: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    loading: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'change', nextState: boolean): void
}>()

function toggle(): void {
  if (props.loading || props.disabled) return
  emit('change', !props.isOn)
}
</script>

<template>
  <div class="inline-flex rounded-md" role="group">
    <UButton
      data-test="btn-on"
      :color="isOn ? 'success' : 'neutral'"
      :variant="isOn ? 'solid' : 'outline'"
      :disabled="loading || disabled"
      @click="toggle"
    >
      On
    </UButton>
    <UButton
      data-test="btn-off"
      :color="!isOn ? 'error' : 'neutral'"
      :variant="!isOn ? 'solid' : 'outline'"
      :disabled="loading || disabled"
      @click="toggle"
    >
      Off
    </UButton>
  </div>
</template>
