<script setup>
const { isAuthenticated, loadFromStorage } = useAuth()
const { orders, loading, fetchOrders } = useOrders()
const { open: openLoginDrawer } = useLoginDrawer()

const statusStyles = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
}

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  loadFromStorage()
  if (isAuthenticated.value) {
    fetchOrders()
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <BackButton class="mb-4" />

    <div class="rounded-2xl bg-gradient-to-r from-theme to-purple-700 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-lg">
      <h1 class="text-2xl sm:text-3xl font-bold mb-1">My Orders</h1>
      <p class="text-white/80 text-sm">Track and review your order history</p>
    </div>

    <ClientOnly>
      <div v-if="!isAuthenticated" class="mt-10 text-center py-16 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="w-16 h-16 mx-auto rounded-full bg-themeSoft flex items-center justify-center text-theme text-2xl">📦</div>
        <p class="mt-4 text-gray-900 font-semibold">Log in to see your orders</p>
        <p class="mt-1 text-sm text-gray-500">Track deliveries and view your order history here.</p>
        <button
          type="button"
          class="mt-6 inline-block px-6 py-2.5 bg-theme hover:opacity-90 transition-opacity text-white font-semibold rounded-lg"
          @click="openLoginDrawer"
        >
          Log In
        </button>
      </div>

      <div v-else-if="loading" class="mt-10 space-y-4">
        <div v-for="n in 3" :key="n" class="rounded-2xl bg-gray-100 h-32 animate-pulse" />
      </div>

      <div v-else-if="orders.length === 0" class="mt-10 text-center py-16 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="w-16 h-16 mx-auto rounded-full bg-themeSoft flex items-center justify-center text-theme text-2xl">📦</div>
        <p class="mt-4 text-gray-900 font-semibold">No orders yet</p>
        <p class="mt-1 text-sm text-gray-500">When you place an order, it'll show up here.</p>
        <NuxtLink
          to="/categories"
          class="mt-6 inline-block px-6 py-2.5 bg-theme hover:opacity-90 transition-opacity text-white font-semibold rounded-lg"
        >
          Start Shopping
        </NuxtLink>
      </div>

      <div v-else class="mt-8 space-y-4">
        <NuxtLink
          v-for="ord in orders"
          :key="ord.id"
          :to="`/order-confirmation/${ord.id}`"
          class="block rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">Order #BS-{{ ord.id }}</p>
              <p class="text-sm text-gray-500 mt-0.5">{{ formatDate(ord.createdAt) }} &middot; {{ ord.items?.length || 0 }} item{{ (ord.items?.length || 0) === 1 ? '' : 's' }}</p>
            </div>
            <span
              class="text-xs font-semibold px-3 py-1 rounded-full"
              :class="statusStyles[ord.fulfillmentStatus] || 'bg-gray-100 text-gray-600'"
            >
              {{ ord.fulfillmentStatus }}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-2">
            <div
              v-for="item in (ord.items || []).slice(0, 4)"
              :key="item.id"
              class="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0"
            >
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>
            <span v-if="(ord.items?.length || 0) > 4" class="text-xs text-gray-400">+{{ ord.items.length - 4 }} more</span>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <p class="font-bold text-gray-900">Rs {{ formatPrice(ord.total) }}</p>
            <span class="text-sm text-theme font-semibold">Track Order &rarr;</span>
          </div>
        </NuxtLink>
      </div>

      <template #fallback>
        <div class="mt-10 space-y-4">
          <div v-for="n in 3" :key="n" class="rounded-2xl bg-gray-100 h-32 animate-pulse" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
