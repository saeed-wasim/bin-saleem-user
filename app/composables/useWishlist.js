export function useWishlist() {
  const items = useState('wishlist-items', () => [])
  const loaded = useState('wishlist-loaded', () => false)
  const loading = ref(false)
  const error = ref(null)

  async function fetchWishlist() {
    const { isAuthenticated, token } = useAuth()
    if (!isAuthenticated.value) {
      items.value = []
      loaded.value = true
      return
    }

    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch('/api/wishlist', {
        baseURL: config.public.apiBaseUrl,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      items.value = response
      loaded.value = true
    } catch (err) {
      error.value = err.data?.error || err.message || 'Failed to fetch wishlist'
      console.error('Error fetching wishlist:', err)
    } finally {
      loading.value = false
    }
  }

  function ensureLoaded() {
    if (!loaded.value) {
      fetchWishlist()
    }
  }

  // Called on logout: clear the visible wishlist immediately. Server data is
  // untouched, so it reappears on the next fetchWishlist() after login.
  function reset() {
    items.value = []
    loaded.value = false
  }

  function isInWishlist(productId) {
    return items.value.some((i) => i.productId === productId)
  }

  async function addToWishlist(product) {
    const config = useRuntimeConfig()
    const { token } = useAuth()
    const previous = items.value
    items.value = [...items.value, { productId: product.id, product }]
    try {
      const response = await $fetch('/api/wishlist', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { productId: product.id },
      })
      items.value = items.value.map((i) => (i.productId === product.id ? response : i))
    } catch (err) {
      items.value = previous
      error.value = err.data?.error || err.message || 'Failed to add to wishlist'
      console.error('Error adding to wishlist:', err)
    }
  }

  async function removeFromWishlist(productId) {
    const config = useRuntimeConfig()
    const { token } = useAuth()
    const previous = items.value
    items.value = items.value.filter((i) => i.productId !== productId)
    try {
      await $fetch(`/api/wishlist/${productId}`, {
        baseURL: config.public.apiBaseUrl,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    } catch (err) {
      items.value = previous
      error.value = err.data?.error || err.message || 'Failed to remove from wishlist'
      console.error('Error removing from wishlist:', err)
    }
  }

  async function toggleWishlist(product) {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated.value) {
      useLoginDrawer().open()
      return
    }

    ensureLoaded()
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  return {
    items,
    loading,
    error,
    fetchWishlist,
    ensureLoaded,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    reset,
  }
}
