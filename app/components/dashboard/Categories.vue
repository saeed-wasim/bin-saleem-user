<script setup>
const PAGE_SIZE = 20;

const route = useRoute();
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
  pagination,
  fetchProducts,
} = useProducts();

const categoryId = computed(() =>
  route.query.categoryId ? Number(route.query.categoryId) : null,
);
const searchQuery = computed(() =>
  route.query.search ? String(route.query.search).trim() : "",
);
const isSearching = computed(() => searchQuery.value.length > 0);

const activeCategory = computed(() =>
  categories.value.find((c) => c.id === categoryId.value),
);

const hasMore = computed(
  () =>
    !!pagination.value && pagination.value.page < pagination.value.totalPages,
);
const loadingMore = ref(false);

function loadFirstPage() {
  fetchProducts({
    categoryId: categoryId.value,
    search: searchQuery.value,
    page: 1,
    limit: PAGE_SIZE,
  });
}

async function loadMore() {
  if (!pagination.value || loadingMore.value) return;
  loadingMore.value = true;
  try {
    await fetchProducts({
      categoryId: categoryId.value,
      search: searchQuery.value,
      page: pagination.value.page + 1,
      limit: PAGE_SIZE,
      append: true,
    });
  } finally {
    loadingMore.value = false;
  }
}

onMounted(() => {
  fetchCategories();
  if (categoryId.value || isSearching.value) loadFirstPage();
});

watch([categoryId, searchQuery], ([id, search]) => {
  if (id || search) loadFirstPage();
});
</script>

<template>
  <div class="container mx-auto p-3 sm:p-6">
    <div v-if="isSearching">
      <BackButton class="mb-4" />
      <h1 class="text-3xl font-bold mb-6">
        Search results for "{{ searchQuery }}"
      </h1>

      <div v-if="productsLoading && !products.length" class="text-gray-500">
        Searching...
      </div>
      <div v-else-if="productsError" class="text-red-500">
        Error searching products: {{ productsError }}
      </div>
      <div v-else-if="products.length === 0" class="text-gray-500">
        No products found matching "{{ searchQuery }}". Try a different name or
        check the spelling.
      </div>

      <template v-else>
        <div
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

        <div v-if="hasMore" class="mt-8 text-center">
          <button
            type="button"
            class="inline-block border border-theme text-theme hover:bg-theme hover:text-white transition-colors px-6 py-2 font-semibold disabled:opacity-60"
            :disabled="loadingMore"
            @click="loadMore"
          >
            {{ loadingMore ? "Loading..." : "View More" }}
          </button>
        </div>
      </template>
    </div>

    <div v-else-if="categoryId">
      <BackButton class="mb-4" />

      <div class="text-center mb-8 sm:mb-10">
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-theme">
          {{ activeCategory?.name || "Products" }}
        </h1>
      </div>

      <div v-if="productsLoading && !products.length" class="text-gray-500 text-center">
        Loading products...
      </div>
      <div v-else-if="productsError" class="text-red-500 text-center">
        Error loading products: {{ productsError }}
      </div>
      <div v-else-if="products.length === 0" class="text-gray-500 text-center">
        No products found in this category
      </div>

      <template v-else>
        <div
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

        <div v-if="hasMore" class="mt-8 text-center">
          <button
            type="button"
            class="inline-block border border-theme text-theme hover:bg-theme hover:text-white transition-colors px-6 py-2 font-semibold disabled:opacity-60"
            :disabled="loadingMore"
            @click="loadMore"
          >
            {{ loadingMore ? "Loading..." : "View More" }}
          </button>
        </div>
      </template>
    </div>

    <div v-else>
      <BackButton class="mb-4" />

      <div class="text-center mb-8 sm:mb-10">
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-theme">
          Curated Collections
        </h1>
        <p class="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Discover our masterfully crafted pieces, where tradition meets
          contemporary luxury.
        </p>
      </div>

      <div v-if="categoriesLoading" class="text-gray-500">
        Loading categories...
      </div>
      <div v-else-if="categoriesError" class="text-red-500">
        Error loading categories: {{ categoriesError }}
      </div>
      <div v-else-if="categories.length === 0" class="text-gray-500">
        No categories found
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      >
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/categories', query: { categoryId: category.id } }"
          class="group relative block rounded-xl overflow-hidden aspect-[4/5] bg-gray-100"
        >
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          />
          <p
            class="absolute bottom-4 left-4 right-4 text-white text-lg font-bold"
          >
            {{ category.name }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
