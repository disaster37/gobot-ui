<script setup lang="ts">
withDefaults(defineProps<{ isOk: boolean; size?: string }>(), {
  size: '1.5em'
})
</script>

<template>
  <UBadge
    :color="isOk ? 'success' : 'error'"
    variant="solid"
    class="rounded-full"
    :style="{ fontSize: size }"
  >
    <UIcon :name="isOk ? 'i-bi-check' : 'i-bi-x'" :style="{ width: size, height: size }" />
  </UBadge>
</template>
