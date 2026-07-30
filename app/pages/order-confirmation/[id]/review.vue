<script setup>
const route = useRoute()
const orderId = computed(() => route.params.id)
const { order, loading, error, fetchOrder } = useOrders()

const reviewableItems = computed(() => (order.value?.items || []).filter((item) => item.productId))

onMounted(() => fetchOrder(orderId.value))
</script>

<template>
  <div class="mx-auto px-4 sm:px-6 py-16">
    <BackButton class="mb-4" />

    <div v-if="loading" class="text-gray-500 text-center">Loading order...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else-if="order">
      <h1 class="text-2xl font-bold text-gray-900">Rate Your Purchase</h1>
      <p class="text-gray-500 mt-1 mb-8">Order #BS-{{ order.id }} &mdash; share your thoughts on each piece.</p>

      <div v-if="reviewableItems.length === 0" class="text-gray-500">
        There's nothing to review for this order.
      </div>

      <div v-else class="space-y-5">
        <ProductReviewForm
          v-for="item in reviewableItems"
          :key="item.id"
          :product-id="item.productId"
          :product-name="item.name"
          :product-image="item.image"
        />
      </div>

      <NuxtLink :to="`/order-confirmation/${order.id}`" class="inline-block mt-8 text-theme font-semibold">
        Back to Order
      </NuxtLink>
    </div>
  </div>
</template>
