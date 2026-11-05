<script setup lang="ts">
import { computed } from 'vue'
const route = useRoute()
const authStore = useAuthStore()
const boardStore = useBoardStore()

const titles: Record<string, string> = {
  '/': 'Home',
  '/tfp': 'TFP',
  '/dfp': 'DFP',
  '/tank': 'Tank',
  '/config': 'Config',
  '/login': 'Login'
}

const pageTitle = computed(() => titles[route.path] ?? 'Home')

const navItems = [
  { to: '/', label: 'Home', icon: 'i-bi-house' },
  { to: '/tfp', label: 'TFP', icon: 'i-bi-pentagon' },
  { to: '/dfp', label: 'DFP', icon: 'i-bi-arrow-clockwise' },
  { to: '/tank', label: 'Tank', icon: 'i-bi-droplet-half' },
  { to: '/config', label: 'Config', icon: 'i-bi-gear' }
]

async function logout(): Promise<void> {
  await authStore.logout()
}
</script>

<template>
  <div class="dfp-app container-fluid mx-auto p-2">
    <header class="dfp-header bg-sky-200 dark:bg-sky-950 p-3 mb-3 rounded-b-lg shadow-xs">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Pond</h1>
        <h2 class="text-lg">{{ pageTitle }}</h2>
        <UButton
          v-if="authStore.isAuthenticated"
          data-test="logout"
          variant="outline"
          color="neutral"
          size="sm"
          @click="logout"
        >
          Logout
        </UButton>
        <UButton v-else data-test="login" variant="outline" color="neutral" size="sm" to="/login">
          Login
        </UButton>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <BoardState :boards="boardStore.boards" />
        <div class="text-sm">
          <span>Security: off</span>
          |
          <span>Emergency stop: off</span>
          |
          <span>Disable security: off</span>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="dfp-footer bg-sky-200 dark:bg-sky-950 mt-12 p-3 text-center">
      <div class="flex flex-wrap justify-center gap-2">
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          variant="outline"
          color="neutral"
          class="flex-col"
        >
          <UIcon :name="item.icon" class="size-8" />
          <span>{{ item.label }}</span>
        </UButton>
      </div>
    </footer>
  </div>
</template>
