<script setup>
const { items, subtotal, gst, total, clearCart, loadFromStorage } = useCart()
const { placeOrder } = useOrders()
const { isAuthenticated, loadFromStorage: loadAuthFromStorage } = useAuth()
const { open: openLoginDrawer } = useLoginDrawer()
const router = useRouter()

onMounted(() => {
  loadFromStorage()
  loadAuthFromStorage()
})

const step = ref('summary')
const address = ref(null)
const placing = ref(false)
const placeError = ref(null)

const addressTabRef = ref(null)
const paymentTabRef = ref(null)

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

async function handlePlaceOrder() {
  placeError.value = null

  if (!isAuthenticated.value) {
    openLoginDrawer()
    return
  }

  if (step.value === 'summary') {
    step.value = 'address'
    return
  }

  if (step.value === 'address') {
    const savedAddress = await addressTabRef.value?.confirmAddress()
    if (!savedAddress) return
    address.value = savedAddress
    step.value = 'payment'
    return
  }

  placing.value = true
  try {
    const paymentMethod = paymentTabRef.value?.getPaymentMethod()
    const order = await placeOrder({
      items: items.value.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size })),
      address: address.value,
      paymentMethod,
    })
    await router.push(`/order-confirmation/${order.id}`)
    clearCart()
  } catch (err) {
    placeError.value = err.data?.error || err.message || 'Unable to place order'
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <div v-if="items.length === 0" class="text-center text-gray-500 py-24">
      Your bag is empty.
      <NuxtLink to="/categories" class="text-theme font-semibold ml-1">Continue shopping</NuxtLink>
    </div>

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-8">
        <h1 class="text-sm font-bold uppercase tracking-wider text-gray-900">My Shopping Bag</h1>
        <nav class="flex items-center gap-6 text-sm">
          <button
            type="button"
            class="hover:text-theme"
            :class="step === 'summary' ? 'font-bold text-gray-900 underline underline-offset-4' : 'text-gray-400'"
            @click="step = 'summary'"
          >
            Summary
          </button>
          <button
            type="button"
            class="hover:text-theme"
            :class="step === 'address' ? 'font-bold text-gray-900 underline underline-offset-4' : 'text-gray-400'"
            @click="step = 'address'"
          >
            Address
          </button>
          <button
            type="button"
            class="hover:text-theme"
            :class="step === 'payment' ? 'font-bold text-gray-900 underline underline-offset-4' : 'text-gray-400'"
            @click="step = 'payment'"
          >
            Payment
          </button>
        </nav>
        <div class="text-right text-sm">
          <p class="text-gray-500">Bag Value: {{ items.length }} item(s)</p>
          <p class="font-bold text-gray-900">Rs {{ formatPrice(total) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <BagSummaryTab v-if="step === 'summary'" />
          <BagAddressTab v-else-if="step === 'address'" ref="addressTabRef" />
          <BagPaymentTab v-else ref="paymentTabRef" />
        </div>

        <div>
          <div class="border border-gray-200 rounded p-5 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold text-gray-900">Rs {{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">GST</span>
              <span class="font-semibold text-gray-900">Rs {{ formatPrice(gst) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Delivery Charges</span>
              <span class="font-semibold text-gray-900">FREE</span>
            </div>
          </div>

          <button
            type="button"
            class="w-full mt-4 bg-theme hover:opacity-90 transition-opacity text-white font-semibold uppercase tracking-wide rounded py-3 disabled:opacity-60"
            :disabled="placing"
            @click="handlePlaceOrder"
          >
            {{ placing ? 'Placing Order...' : 'Place Order' }}
          </button>

          <p v-if="placeError" class="text-red-500 text-sm mt-3">{{ placeError }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
