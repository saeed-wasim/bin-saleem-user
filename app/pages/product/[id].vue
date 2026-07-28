<script setup>
const route = useRoute()
const productId = computed(() => route.params.id)

const { product, loading, error, fetchProduct } = useProducts()
const { addItem } = useCart()

const sizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13']
const selectedSize = ref('7')

const isRing = computed(() => product.value?.category?.name?.toLowerCase() === 'rings')

function formatPrice(price) {
  return Number(price).toLocaleString('en-IN')
}

async function load() {
  await fetchProduct(productId.value)
}

function handleAddToBag() {
  addItem(product.value, { size: selectedSize.value, qty: 1 })
  navigateTo('/bag')
}

onMounted(load)
watch(productId, load)
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 py-10">
    <BackButton class="mb-6" />

    <div v-if="loading" class="text-gray-500 text-center py-20">Loading product...</div>
    <div v-else-if="error" class="text-red-500 text-center py-20">Error loading product: {{ error }}</div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div class="rounded-2xl border border-gray-100 shadow-sm bg-white aspect-square flex items-center justify-center overflow-hidden">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-contain"
        />
      </div>

      <div>
        <h1 class="text-xl font-bold uppercase tracking-wide text-gray-900">{{ product.name }}</h1>
        <p class="text-xs font-semibold text-gray-500 tracking-wider mt-1">STYLE # {{ product.id }}</p>

        <p class="text-2xl font-bold text-theme mt-4">Rs {{ formatPrice(product.price) }}</p>

        <div v-if="product.length || product.width" class="mt-8">
          <h2 class="text-sm font-bold uppercase tracking-wide text-gray-900 mb-2">Dimensions</h2>
          <p class="text-sm text-gray-600">
            <span v-if="product.length">Length: {{ product.length }} </span>
            <span v-if="product.width">Width: {{ product.width }} </span>
            Cm
          </p>
        </div>

        <p class="text-sm text-gray-600 mt-8 leading-relaxed">{{ product.description }}</p>

        <div v-if="isRing" class="mt-8">
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Size</label>
          <select
            v-model="selectedSize"
            class="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-theme"
          >
            <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <button
          type="button"
          class="w-full mt-6 bg-theme hover:opacity-90 transition-opacity text-white font-semibold uppercase tracking-wide rounded py-3"
          @click="handleAddToBag"
        >
          Add to Bag
        </button>
      </div>
    </div>
  </div>
</template>
