<script setup>
const { products, loading, error, fetchProducts } = useProducts();

onMounted(() => {
  fetchProducts({ newArrivals: true });
});
</script>

<template>
  <div class="container mx-auto p-3 sm:p-6">
    <BackButton class="mb-4" />
    <!-- New Arrivals -->
    <div class="text-center mb-8 sm:mb-10">
      <h1 class="font-serif text-2xl sm:text-3xl font-bold text-theme">
        New Arrivals
      </h1>
      <p class="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        Explore our latest designs, crafted with modern elegance and precision.
      </p>
    </div>
    <div v-if="loading" class="text-gray-500">Loading new arrivals...</div>
    <div v-else-if="error" class="text-red-500">
      Error loading products: {{ error }}
    </div>
    <div
      v-else-if="products.length === 0"
      class="text-gray-500 py-16 text-center"
    >
      Nothing new this week — check back soon.
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
