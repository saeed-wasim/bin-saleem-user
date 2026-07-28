export const useProducts = () => {
  const products = ref([])
  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref(null)

  const fetchProducts = async ({ categoryId, search, page, limit, append = false } = {}) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch('/api/products', {
        baseURL: config.public.apiBaseUrl,
        query: {
          ...(categoryId ? { categoryId } : {}),
          ...(search ? { search } : {}),
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
        },
      })

      if (Array.isArray(response)) {
        products.value = response
        pagination.value = null
      } else {
        products.value = append ? [...products.value, ...response.data] : response.data
        pagination.value = response.pagination
      }

      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch(`/api/products/${id}`, {
        baseURL: config.public.apiBaseUrl,
      })
      product.value = response
      return response
    } catch (err) {
      error.value = err.message || 'Failed to fetch product'
      console.error('Error fetching product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProduct
  }
}
