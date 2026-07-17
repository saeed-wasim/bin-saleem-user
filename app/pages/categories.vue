<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Categories</h1>
    
    <div v-if="loading" class="text-gray-500">
      Loading categories...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Error loading categories: {{ error }}
    </div>
    
    <div v-else-if="categories && categories.length === 0" class="text-gray-500">
      No categories found
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
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
      </div>
    </div>
  </div>
</template>

<script setup>
const { categories, loading, error, fetchCategories } = useCategories()

onMounted(() => {
  fetchCategories()
})
</script>
