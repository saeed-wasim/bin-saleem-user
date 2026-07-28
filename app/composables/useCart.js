const CART_KEY = 'bs_cart_items'
const GST_RATE = 0.03

export function useCart() {
  const items = useState('cart-items', () => [])
  const loaded = useState('cart-loaded', () => false)

  function loadFromStorage() {
    if (import.meta.client && !loaded.value) {
      const stored = localStorage.getItem(CART_KEY)
      items.value = stored ? JSON.parse(stored) : []
      loaded.value = true
    }
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem(CART_KEY, JSON.stringify(items.value))
    }
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
    subtotal,
    gst,
    shipping,
    total,
  }
}
