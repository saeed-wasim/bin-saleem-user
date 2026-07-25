export const useProducts = () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch('/api/products', {
        baseURL: config.public.apiBaseUrl,
      })
      products.value = response
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts
  }
}
