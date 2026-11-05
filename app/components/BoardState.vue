<script setup lang="ts">
import type { Board } from '~/types/models'

defineProps<{ boards: Board[] }>()
</script>

<template>
  <span class="dfp-board-state">
    <template v-if="boards.length">
      <span v-for="board in boards" :key="board.id">
        {{ board.id.toUpperCase() }}:&nbsp;<StatusIcon :is-ok="board.isOnline" size="1.5em" />
        &nbsp; | &nbsp;
      </span>
    </template>
    <span v-else>No boards connected</span>
  </span>
</template>
