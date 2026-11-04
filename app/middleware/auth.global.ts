export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.hydrate()

  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined
    })
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
