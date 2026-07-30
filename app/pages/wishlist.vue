<script setup>
const { loadFromStorage } = useAuth()
const { items, loading, fetchWishlist } = useWishlist()

onMounted(() => {
  loadFromStorage()
  fetchWishlist()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <BackButton class="mb-4" />

    <div class="rounded-2xl bg-gradient-to-r from-theme to-purple-700 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-lg">
      <h1 class="text-2xl sm:text-3xl font-bold mb-1">Your Wishlist</h1>
      <p class="text-white/80 text-sm">Pieces you've saved for later</p>
    </div>

    <ClientOnly>
      <div v-if="loading" class="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <div v-for="n in 4" :key="n" class="rounded-2xl bg-gray-100 aspect-[3/4] animate-pulse" />
      </div>

      <div v-else-if="items.length === 0" class="mt-10 text-center py-16 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="w-16 h-16 mx-auto rounded-full bg-themeSoft flex items-center justify-center text-theme text-2xl">♥</div>
        <p class="mt-4 text-gray-900 font-semibold">Your wishlist is empty</p>
        <p class="mt-1 text-sm text-gray-500">Tap the heart on any product to save it here.</p>
        <NuxtLink
          to="/categories"
          class="mt-6 inline-block px-6 py-2.5 bg-theme hover:opacity-90 transition-opacity text-white font-semibold rounded-lg"
        >
          Explore Products
        </NuxtLink>
      </div>

      <div v-else class="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <NuxtLink v-for="item in items" :key="item.productId" :to="`/product/${item.productId}`">
          <ProductCard :product="item.product" />
        </NuxtLink>
      </div>

      <template #fallback>
        <div class="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <div v-for="n in 4" :key="n" class="rounded-2xl bg-gray-100 aspect-[3/4] animate-pulse" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
