export const useCategories = () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch('/api/categories', {
        baseURL: config.public.apiBaseUrl,
      })
      categories.value = response
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
