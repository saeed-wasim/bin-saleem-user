const WISHLIST_KEY = 'bs_wishlist_items'

// Guests keep their wishlist in localStorage, same pattern as the guest cart,
// since there's no account to save it against yet.
function loadGuestItems() {
  if (!import.meta.client) return []
  const stored = localStorage.getItem(WISHLIST_KEY)
  return stored ? JSON.parse(stored) : []
}

export function useWishlist() {
  const items = useState('wishlist-items', () => [])
  const loaded = useState('wishlist-loaded', () => false)
  const loading = ref(false)
  const error = ref(null)

  function persistGuestItems() {
    if (import.meta.client) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items.value))
    }
  }

  async function fetchWishlist() {
    const { isAuthenticated, token } = useAuth()
    if (!isAuthenticated.value) {
      items.value = loadGuestItems()
      loaded.value = true
      return items.value
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
      return response
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

  // Called on logout: show the account's wishlist gives way to the guest
  // list again. Server data is untouched, so it reappears on next login.
  function reset() {
    items.value = []
    loaded.value = false
  }

  function isInWishlist(productId) {
    return items.value.some((i) => i.productId === productId)
  }

  async function addToWishlist(product) {
    const { isAuthenticated, token } = useAuth()

    if (!isAuthenticated.value) {
      if (isInWishlist(product.id)) return
      items.value = [...items.value, { productId: product.id, product }]
      persistGuestItems()
      return
    }

    const config = useRuntimeConfig()
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
    const { isAuthenticated, token } = useAuth()

    if (!isAuthenticated.value) {
      items.value = items.value.filter((i) => i.productId !== productId)
      persistGuestItems()
      return
    }

    const config = useRuntimeConfig()
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

  // No login required — wishlisting works the same for guests and
  // signed-in customers, it's just backed by localStorage until they log in.
  async function toggleWishlist(product) {
    ensureLoaded()
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  // Called right after login: push whatever was wishlisted as a guest into
  // this account's saved wishlist instead of losing it, mirroring the cart's
  // guest -> account merge on login.
  async function adoptCustomer() {
    if (!import.meta.client) return
    const guestItems = loadGuestItems()
    localStorage.removeItem(WISHLIST_KEY)

    loaded.value = false
    await fetchWishlist()

    for (const guestItem of guestItems) {
      if (!isInWishlist(guestItem.productId)) {
        await addToWishlist(guestItem.product)
      }
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
    addToWishlist,
    removeFromWishlist,
    adoptCustomer,
    reset,
  }
}
