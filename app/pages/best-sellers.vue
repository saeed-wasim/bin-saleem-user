<script setup>
const { products, loading, error, fetchBestSellers } = useProducts();

onMounted(() => {
  fetchBestSellers({ limit: 15 });
});
</script>

<template>
  <div class="container mx-auto p-3 sm:p-6">
    <BackButton class="mb-4" />
    <!-- Best Sellers -->
    <div class="text-center mb-8 sm:mb-10">
      <h1 class="font-serif text-2xl sm:text-3xl font-bold text-theme">
        Best Sellers
      </h1>
      <p class="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        Shop our most loved pieces, chosen by customers for every occasion.
      </p>
    </div>
    <div v-if="loading" class="text-gray-500">Loading best sellers...</div>
    <div v-else-if="error" class="text-red-500">
      Error loading products: {{ error }}
    </div>
    <div
      v-else-if="products.length === 0"
      class="text-gray-500 py-16 text-center"
    >
      No sales data yet — check back once orders start coming in.
    </div>

    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
    >
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/product/${product.id}`"
      >
        <ProductCard :product="product" />
      </NuxtLink>
    </div>
  </div>
</template>
