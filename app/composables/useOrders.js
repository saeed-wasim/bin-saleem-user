export const useOrders = () => {
  const order = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const placeOrder = async ({ items, address, paymentMethod }) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch('/api/orders', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { items, address, paymentMethod },
      })
      order.value = response
      return response
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        await useAuth().sessionExpired()
      }
      error.value = err.data?.error || err.message || 'Failed to place order'
      console.error('Error placing order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOrder = async (id) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch(`/api/orders/${id}`, {
        baseURL: config.public.apiBaseUrl,
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
      order.value = response
      return response
    } catch (err) {
      error.value = err.data?.error || err.message || 'Failed to fetch order'
      console.error('Error fetching order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    order,
    loading,
    error,
    placeOrder,
    fetchOrder,
  }
}
