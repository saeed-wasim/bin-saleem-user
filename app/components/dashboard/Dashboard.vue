<script setup>
const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  fetchCategories,
} = useCategories();
const {
  products,
  loading: productsLoading,
  error: productsError,
  fetchProducts,
} = useProducts();

const activeCategoryId = ref(null);

const activeCategory = computed(() =>
  categories.value.find((c) => c.id === activeCategoryId.value)
);

const filteredProducts = computed(() =>
  activeCategoryId.value
    ? products.value.filter(
        (p) =>
          p.categoryId === activeCategoryId.value ||
          p.category?.id === activeCategoryId.value
      )
    : []
);

onMounted(async () => {
  await fetchCategories();
  if (categories.value.length && !activeCategoryId.value) {
    activeCategoryId.value = categories.value[0].id;
  }
  fetchProducts();
});
</script>

<template>
  <div>
    <!-- Hero -->
    <div>
      <Hero/>
    </div>

    <div class="container mx-auto px-4 sm:px-6 py-10">

      <!-- Loading -->
      <div v-if="categoriesLoading" class="text-center text-gray-500">
        Loading categories...
      </div>

      <div v-else-if="categoriesError" class="text-center text-red-500">
        {{ categoriesError }}
      </div>

      <template v-else>

        <!-- Heading -->
        <div class="flex items-center gap-5 mb-10">
          <div class="flex-1 h-px bg-gray-300"></div>

          <h2
            class="shrink-0 uppercase tracking-[0.25em] text-sm sm:text-base font-medium text-gray-800"
          >
            Shop by Category
          </h2>

          <div class="flex-1 h-px bg-gray-300"></div>
        </div>

        <!-- Categories -->
        <div
          class="flex md:justify-center justify-start gap-4 overflow-x-auto no-scrollbar pb-3"
        >
          <template
            v-for="(category, index) in categories"
            :key="category.id"
          >
            <NuxtLink
              :to="{ path: '/categories', query: { categoryId: category.id } }"
              :class="[
                'flex-shrink-0',
                'flex items-center justify-center text-center',
                'h-14 min-w-[140px] px-6',
                'font-semibold text-xl transition-all duration-300',
                'bg-[#cccccc] text-white'
              ]"
            >
              {{ category.name }}
            </NuxtLink>
          </template>
        </div>

        <!-- Products -->
        <div v-if="productsLoading" class="text-center py-12">
          Loading products...
        </div>

        <div
          v-else-if="productsError"
          class="text-center text-red-500 py-12"
        >
          {{ productsError }}
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="text-center text-gray-500 py-12"
        >
          No products found.
        </div>

        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10"
        >
          <NuxtLink
            v-for="product in filteredProducts.slice(0, 20)"
            :key="product.id"
            :to="`/product/${product.id}`"
          >
            <ProductCard :product="product" />
          </NuxtLink>
        </div>

        <!-- View All -->
        <div v-if="activeCategory" class="text-center mt-10">
          <NuxtLink
            :to="{ path: '/categories', query: { categoryId: activeCategory.id } }"
            class="inline-flex items-center border border-theme text-theme hover:bg-theme hover:text-white px-8 py-3 font-semibold transition rounded"
          >
            View All {{ activeCategory.name }}
          </NuxtLink>
        </div>

      </template>
    </div>
  </div>
</template>