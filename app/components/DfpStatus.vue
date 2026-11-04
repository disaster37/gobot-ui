<script setup lang="ts">
defineProps<{ isOn: boolean }>()
</script>

<template>
  <UIcon :name="isOn ? 'i-bi-arrow-repeat' : 'i-bi-circle'" class="size-6" />
</template>
