<script setup>
const route = useRoute()
const orderId = computed(() => route.params.id)
const { order, loading, error, fetchOrder } = useOrders()

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

onMounted(() => fetchOrder(orderId.value))
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
    <div v-if="loading" class="text-gray-500">Loading order...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="order">
      <div class="w-16 h-16 mx-auto rounded-full bg-themeSoft flex items-center justify-center text-theme text-3xl">✓</div>
      <h1 class="text-2xl font-bold text-gray-900 mt-6">Thank you for your order!</h1>
      <p class="text-gray-500 mt-2">Order #BS-{{ order.id }} has been placed successfully.</p>

      <div class="border border-gray-200 rounded-lg mt-8 p-6 text-left">
        <div v-for="item in order.items" :key="item.id" class="flex justify-between py-2 text-sm">
          <span class="text-gray-700">
            {{ item.name }} <span v-if="item.size">(Size: {{ item.size }})</span> &times; {{ item.qty }}
          </span>
          <span class="font-semibold text-gray-900">Rs {{ formatPrice(item.price * item.qty) }}</span>
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

      <NuxtLink to="/" class="inline-block mt-8 text-theme font-semibold">Continue Shopping</NuxtLink>
    </div>
  </div>
</template>
