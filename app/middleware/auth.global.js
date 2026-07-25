const protectedPaths = ['/dashboard', '/account']

export default defineNuxtRouteMiddleware((to) => {
  if (!protectedPaths.includes(to.path)) {
    return
  }

  if (import.meta.server) {
    return
  }

  const { isAuthenticated, loadFromStorage } = useAuth()
  loadFromStorage()

  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
