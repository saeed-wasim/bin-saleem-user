<script setup>
const route = useRoute()
const orderId = computed(() => route.params.id)
const { order, loading, error, fetchOrder, syncPaymentStatus } = useOrders()

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

onMounted(async () => {
  await fetchOrder(orderId.value)
  // Coming back from Stripe Checkout — reconcile in case the webhook hasn't
  // landed yet (e.g. local dev without the Stripe CLI forwarder running).
  if (route.query.session_id && order.value?.paymentStatus !== 'Paid') {
    try {
      await syncPaymentStatus(orderId.value)
    } catch (err) {
      console.error('Error syncing payment status:', err)
    }
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
    <div class="text-left mb-4">
      <BackButton />
    </div>

    <div v-if="loading" class="text-gray-500">Loading order...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="order">
      <div class="w-16 h-16 mx-auto rounded-full bg-themeSoft flex items-center justify-center text-theme text-3xl">✓</div>
      <h1 class="text-2xl font-bold text-gray-900 mt-6">Thank you for your order!</h1>
      <p class="text-gray-500 mt-2">Order #BS-{{ order.id }} has been placed successfully.</p>
      <p class="text-xs font-semibold uppercase tracking-wider mt-1" :class="order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'">
        Payment: {{ order.paymentStatus }}
      </p>

      <div class="border border-gray-200 rounded-lg mt-8 p-6">
        <OrderTimeline
          :fulfillment-status="order.fulfillmentStatus"
          :created-at="order.createdAt"
          :shipped-at="order.shippedAt"
          :delivered-at="order.deliveredAt"
        />
      </div>

      <div class="border border-gray-200 rounded-lg mt-6 p-6 text-left">
        <div v-for="item in order.items" :key="item.id" class="py-2 text-sm border-b border-gray-100 last:border-0">
          <div class="flex justify-between">
            <span class="text-gray-700">
              {{ item.name }} <span v-if="item.size">(Size: {{ item.size }})</span> &times; {{ item.qty }}
            </span>
            <span class="font-semibold text-gray-900">Rs {{ formatPrice(item.price * item.qty) }}</span>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-4 pt-4 space-y-1 text-sm">
          <div class="flex justify-between"><span class="text-gray-600">Subtotal</span><span>Rs {{ formatPrice(order.subtotal) }}</span></div>
          <div class="flex justify-between"><span class="text-gray-600">GST</span><span>Rs {{ formatPrice(order.gst) }}</span></div>
          <div class="flex justify-between font-bold text-gray-900 mt-1"><span>Total</span><span>Rs {{ formatPrice(order.total) }}</span></div>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg mt-6 p-6 text-left text-sm text-gray-600">
        <p class="font-semibold text-gray-900 mb-1">Delivery Address</p>
        <p>{{ order.addressName }}</p>
        <p>{{ order.addressStreet }}</p>
        <p>{{ order.addressPhone }}</p>
        <p>{{ order.addressCity }}</p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 mt-8">
        <NuxtLink
          v-if="order.items?.some((i) => i.productId)"
          :to="`/order-confirmation/${order.id}/review`"
          class="inline-flex items-center gap-1.5 px-6 py-2.5 bg-theme hover:opacity-90 transition-opacity text-white text-sm font-semibold rounded-lg"
        >
          ★ Rate Your Purchase
        </NuxtLink>
        <NuxtLink to="/" class="text-theme font-semibold">Continue Shopping</NuxtLink>
      </div>
    </div>
  </div>
</template>
