<script setup>
const route = useRoute()
const { categories, loading: categoriesLoading, error: categoriesError, fetchCategories } = useCategories()
const { products, loading: productsLoading, error: productsError, fetchProducts } = useProducts()

const categoryId = computed(() => route.query.categoryId ? Number(route.query.categoryId) : null)

const activeCategory = computed(() =>
  categories.value.find((c) => c.id === categoryId.value)
)

const filteredProducts = computed(() =>
  categoryId.value
    ? products.value.filter((p) => p.categoryId === categoryId.value || p.category?.id === categoryId.value)
    : products.value
)

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div v-if="categoryId">
      <h1 class="text-3xl font-bold mb-6">{{ activeCategory?.name || 'Products' }}</h1>

      <div v-if="productsLoading" class="text-gray-500">Loading products...</div>
      <div v-else-if="productsError" class="text-red-500">Error loading products: {{ productsError }}</div>
      <div v-else-if="filteredProducts.length === 0" class="text-gray-500">No products found in this category</div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-6">Categories</h1>

      <div v-if="categoriesLoading" class="text-gray-500">Loading categories...</div>
      <div v-else-if="categoriesError" class="text-red-500">Error loading categories: {{ categoriesError }}</div>
      <div v-else-if="categories.length === 0" class="text-gray-500">No categories found</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/categories', query: { categoryId: category.id } }"
          class="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div v-if="category.image" class="mb-4">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-48 object-cover rounded"
            />
          </div>
          <h2 class="text-xl font-semibold mb-2">{{ category.name }}</h2>
          <p class="text-gray-600">{{ category.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
