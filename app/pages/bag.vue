<script setup>
const { items, subtotal, gst, total, loadFromStorage } = useCart()
const { createCheckoutSession, resumeCheckoutSession, fetchOrder } = useOrders()
const { isAuthenticated, loadFromStorage: loadAuthFromStorage } = useAuth()
const { open: openLoginDrawer } = useLoginDrawer()
const route = useRoute()
const router = useRouter()

// Set when returning from a cancelled/abandoned Stripe session for a still-
// "Pending" order, so the next attempt resumes that same order instead of
// placing a duplicate one (which would reserve stock twice).
const pendingOrderId = ref(null)

onMounted(async () => {
  loadFromStorage()
  loadAuthFromStorage()

  const returnedOrderId = route.query.orderId
  if (returnedOrderId) {
    try {
      const order = await fetchOrder(returnedOrderId)
      if (order?.paymentStatus === 'Pending') {
        pendingOrderId.value = order.id
      }
    } catch (err) {
      // Not resumable (not found, not ours, or already paid) — fall back to
      // a normal, fresh order on the next "Place Order" click.
    }
    router.replace({ path: '/bag' })
  }
})

// Any cart edit after returning to a resumable order means the order no
// longer matches the bag, so the next attempt must build a fresh one.
watch(items, () => {
  pendingOrderId.value = null
})

const steps = [
  { key: 'summary', label: 'Summary' },
  { key: 'address', label: 'Address' },
  { key: 'payment', label: 'Payment' },
]

const step = ref('summary')
const address = ref(null)
const placing = ref(false)
const placeError = ref(null)
const redirecting = ref(false)

const addressTabRef = ref(null)
const paymentTabRef = ref(null)

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

// Jumping straight to Payment via the tab (instead of via "Continue" on the
// Address step) would otherwise skip confirming an address entirely.
function goToStep(target) {
  if (target === 'payment' && !address.value) {
    step.value = 'address'
    return
  }
  step.value = target
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
    const session = pendingOrderId.value
      ? await resumeCheckoutSession(pendingOrderId.value)
      : await createCheckoutSession({
          items: items.value.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size })),
          address: address.value,
          paymentMethod: paymentTabRef.value?.getPaymentMethod(),
        })
    // The cart is intentionally left alone here — if the customer cancels or
    // closes the Stripe tab, they land back on /bag and can retry against
    // this same order. It's only cleared once payment is actually confirmed,
    // on the order-confirmation page.
    redirecting.value = true
    window.location.href = session.url
  } catch (err) {
    placeError.value = err.data?.error || err.message || 'Unable to start checkout'
    placing.value = false
  }
}
</script>

<template>
  <div class="mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <BackButton class="mb-6" label="Back" />

    <div v-if="items.length === 0" class="text-center text-gray-500 py-24">
      Your bag is empty.
      <NuxtLink to="/categories" class="text-theme font-semibold ml-1">Continue shopping</NuxtLink>
    </div>

    <template v-else>
      <div class="text-center border-b border-gray-200 pb-6 mb-8">
        <h1 class="font-serif text-3xl font-bold uppercase tracking-wide text-gray-900">Shopping Bag</h1>
        <p class="text-xs uppercase tracking-wider text-gray-400 mt-1">Bag Value: {{ items.length }} item(s)</p>

        <Stepper
          :steps="steps"
          :current="step"
          class="max-w-md mx-auto mt-6"
          @select="goToStep"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="border border-gray-200 rounded p-6">
            <BagSummaryTab v-if="step === 'summary'" />
            <BagAddressTab v-else-if="step === 'address'" ref="addressTabRef" />
            <BagPaymentTab v-else ref="paymentTabRef" />
          </div>
        </div>

        <div>
          <div class="border border-gray-200 rounded p-5 text-sm">
            <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Order Summary</h2>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold text-gray-900">Rs {{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">GST (Applied)</span>
                <span class="font-semibold text-gray-900">Rs {{ formatPrice(gst) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Delivery Charges</span>
                <span class="font-semibold text-theme">FREE</span>
              </div>
            </div>

            <div class="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span class="font-semibold text-gray-900">Total Bag Value</span>
              <span class="text-lg font-bold text-theme">Rs {{ formatPrice(total) }}</span>
            </div>

            <button
              type="button"
              class="w-full mt-5 bg-theme hover:opacity-90 transition-opacity text-white font-semibold uppercase tracking-wide rounded py-3 disabled:opacity-60"
              :disabled="placing"
              @click="handlePlaceOrder"
            >
              {{ placing ? 'Placing Order...' : 'Place Order' }}
            </button>

            <p v-if="placeError" class="text-red-500 text-sm mt-3">{{ placeError }}</p>

            <div class="mt-5 text-center">
              <p class="text-[11px] uppercase tracking-wide text-gray-400">
                Secure checkout powered by <span class="font-serif italic text-gray-600">Bin Saleem</span>
              </p>
              <div class="flex items-center justify-center gap-3 mt-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="redirecting"
      class="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-center px-6"
    >
      <svg class="w-10 h-10 animate-spin text-theme" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <div>
        <p class="font-semibold text-gray-900">Redirecting you to secure payment...</p>
        <p class="text-sm text-gray-500 mt-1">Please wait, do not close or refresh this window.</p>
      </div>
    </div>
  </div>
</template>
