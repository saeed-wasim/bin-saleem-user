<script setup>
import Hero from "/assets/images/hero.jpg";

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
    <div>
      <img :src="Hero" alt="" class="w-full" />
    </div>

    <div class="container mx-auto px-6 py-12">
      <div v-if="categoriesLoading" class="text-gray-500 text-center">
        Loading categories...
      </div>
      <div v-else-if="categoriesError" class="text-red-500 text-center">
        Error loading categories: {{ categoriesError }}
      </div>

      <template v-else>
        <div class="flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-gray-200 mb-8 no-scrollbar">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="shrink-0 pb-3 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap"
            :class="
              activeCategoryId === category.id
                ? 'border-theme text-theme font-semibold'
                : 'border-transparent text-gray-600 hover:text-theme'
            "
            @click="activeCategoryId = category.id"
          >
            {{ category.name }}
          </button>
        </div>

        <div v-if="productsLoading" class="text-gray-500 text-center">
          Loading products...
        </div>
        <div v-else-if="productsError" class="text-red-500 text-center">
          Error loading products: {{ productsError }}
        </div>
        <div
          v-else-if="filteredProducts.length === 0"
          class="text-gray-500 text-center"
        >
          No products found in this category
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in filteredProducts.slice(0, 20)"
            :key="product.id"
            :to="`/product/${product.id}`"
          >
            <ProductCard :product="product" />
          </NuxtLink>
        </div>

        <div v-if="activeCategory" class="mt-8 text-center">
          <NuxtLink
            :to="{ path: '/categories', query: { categoryId: activeCategory.id } }"
            class="inline-block border border-theme text-theme hover:bg-theme hover:text-white transition-colors px-6 py-2 font-semibold"
          >
            View All {{ activeCategory.name }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
