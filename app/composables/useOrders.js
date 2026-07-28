export const useOrders = () => {
  const order = ref(null)
  const orders = ref([])
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

  const createCheckoutSession = async ({ items, address, paymentMethod }) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch('/api/payments/create-checkout-session', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { items, address, paymentMethod },
      })
      return response
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        await useAuth().sessionExpired()
      }
      error.value = err.data?.error || err.message || 'Failed to start checkout'
      console.error('Error creating checkout session:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reconciles a "Pending" order against Stripe directly — a safety net for
  // when the webhook forwarder isn't running (e.g. local dev without the
  // Stripe CLI), so the confirmation page doesn't get stuck showing Pending.
  const syncPaymentStatus = async (id) => {
    const config = useRuntimeConfig()
    const { token } = useAuth()
    const response = await $fetch(`/api/payments/session/${id}/sync`, {
      baseURL: config.public.apiBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    })
    order.value = response
    return response
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

  const fetchOrders = async () => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch('/api/orders/mine', {
        baseURL: config.public.apiBaseUrl,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      orders.value = response
      return response
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        await useAuth().sessionExpired()
      }
      error.value = err.data?.error || err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    order,
    orders,
    loading,
    error,
    placeOrder,
    createCheckoutSession,
    syncPaymentStatus,
    fetchOrder,
    fetchOrders,
  }
}
