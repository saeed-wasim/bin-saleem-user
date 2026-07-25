<script setup>
import Hero from '/assets/images/hero.jpg'

const { categories, loading, error, fetchCategories } = useCategories()

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div>
    <div>
            <img :src="Hero" alt="" class="w-full"/>
    </div>

    <div class="container mx-auto px-6 py-12">
      <div class="flex items-center gap-4 mb-10">
        <div class="flex-1 h-px bg-gray-200" />
        <h2
          class="text-sm font-semibold tracking-widest text-gray-600 uppercase"
        >
          Shop by Category
        </h2>
        <div class="flex-1 h-px bg-gray-200" />
      </div>

      <div v-if="loading" class="text-gray-500 text-center">
        Loading categories...
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        Error loading categories: {{ error }}
      </div>

      <div v-else class="flex flex-wrap justify-center gap-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/categories', query: { categoryId: category.id } }"
          class="bg-gray-400 hover:opacity-90 transition-opacity text-white font-semibold rounded px-6 py-3 text-center min-w-[160px]"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
