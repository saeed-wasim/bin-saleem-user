const CART_KEY = 'bs_cart_items'
const GST_RATE = 0.03

// Guests share one bucket; each logged-in customer gets their own so a
// logout/login on the same device shows an empty cart, then their own
// items again, instead of leaking between accounts.
function cartStorageKey(customerId) {
  return customerId ? `${CART_KEY}_${customerId}` : CART_KEY
}

export function useCart() {
  const items = useState('cart-items', () => [])
  const loaded = useState('cart-loaded', () => false)
  const customerId = useState('cart-customer-id', () => null)

  function loadFromStorage() {
    if (import.meta.client && !loaded.value) {
      const { isAuthenticated, user } = useAuth()
      customerId.value = isAuthenticated.value ? user.value?.id ?? null : null
      const stored = localStorage.getItem(cartStorageKey(customerId.value))
      items.value = stored ? JSON.parse(stored) : []
      loaded.value = true
    }
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(cartStorageKey(customerId.value), JSON.stringify(items.value))
    }
  }

  // Called right after a successful login: switch to this customer's own
  // saved cart. If they've never shopped on this device before, keep
  // whatever they added while browsing as a guest as the start of their cart.
  function adoptCustomer(id) {
    if (!import.meta.client) return
    const wasGuest = customerId.value === null
    customerId.value = id
    const stored = localStorage.getItem(cartStorageKey(id))
    if (stored) {
      items.value = JSON.parse(stored)
    } else if (wasGuest) {
      persist()
    } else {
      items.value = []
      persist()
    }
    loaded.value = true
  }

  // Called on logout: hide the cart immediately without deleting the
  // customer's saved items, so they reappear the next time they log in.
  function reset() {
    items.value = []
    customerId.value = null
    loaded.value = true
  }

  function addItem(product, { size = null, qty = 1 } = {}) {
    loadFromStorage()
    const existing = items.value.find((i) => i.productId === product.id && i.size === size)
    if (existing) {
      existing.qty += qty
      items.value = [...items.value]
    } else {
      items.value = [
        ...items.value,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          color: product.color,
          size,
          qty,
        },
      ]
    }
    persist()
  }

  function updateQty(productId, size, qty) {
    const item = items.value.find((i) => i.productId === productId && i.size === size)
    if (item) {
      item.qty = Math.max(1, qty)
      items.value = [...items.value]
      persist()
    }
  }

  function updateSize(productId, oldSize, newSize) {
    const item = items.value.find((i) => i.productId === productId && i.size === oldSize)
    if (item) {
      item.size = newSize
      items.value = [...items.value]
      persist()
    }
  }

  function removeItem(productId, size) {
    items.value = items.value.filter((i) => !(i.productId === productId && i.size === size))
    persist()
  }

  function clearCart() {
    items.value = []
    persist()
  }

  const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))
  const gst = computed(() => Math.round(subtotal.value * GST_RATE * 100) / 100)
  const shipping = computed(() => 0)
  const total = computed(() => subtotal.value + gst.value + shipping.value)

  return {
    items,
    loadFromStorage,
    addItem,
    updateQty,
    updateSize,
    removeItem,
    clearCart,
    adoptCustomer,
    reset,
    subtotal,
    gst,
    shipping,
    total,
  }
}
