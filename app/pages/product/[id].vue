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
  <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-10">
    <BackButton class="mb-4 sm:mb-8" />

    <div v-if="loading" class="py-20 text-center text-gray-500">
      Loading product...
    </div>

    <div v-else-if="error" class="py-20 text-center text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="product"
      class="grid grid-cols-1 lg:grid-cols-[1.7fr_0.9fr] gap-6 lg:gap-10 items-start"
    >
      <!-- Image -->
      <div
        class="rounded-3xl border border-gray-200 bg-white h-72 sm:h-[450px] lg:h-[650px] flex items-center justify-center overflow-hidden"
      >
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="max-w-full max-h-full object-contain p-3"
        />
      </div>

      <!-- Details -->
      <div class="max-w-sm">
        <h1 class="text-md font-bold uppercase leading-snug text-gray-900">
          {{ product.name }}
        </h1>

        <p
          v-if="product.sku"
          class="mt-3 text-sm uppercase tracking-wide text-gray-500"
        >
          Style # {{ product.sku }}
        </p>

        <p class="mt-4 text-md font-semibold text-theme">
          Rs {{ formatPrice(product.price) }}
        </p>

        <!-- Dimensions -->
        <div
          v-if="product.length || product.width"
          class="mt-6 sm:mt-10"
        >
          <h3 class="font-semibold uppercase text-gray-900 mb-3">
            Dimensions
          </h3>

          <p class="text-sm text-gray-600">
            <span v-if="product.length">
              Length: {{ product.length }}
            </span>

            <span
              v-if="product.length && product.width"
              class="mx-2"
            >
              |
            </span>

            <span v-if="product.width">
              Width: {{ product.width }}
            </span>

            <span> cm</span>
          </p>
        </div>

        <!-- Description -->
        <p
          v-if="product.description"
          class="mt-6 sm:mt-10 text-sm leading-7 text-gray-600"
        >
          {{ product.description }}
        </p>

        <!-- Ring Size -->
        <div
          v-if="isRing"
          class="mt-6 sm:mt-8"
        >
          <label class="block text-sm font-semibold mb-2">
            Size
          </label>

          <select
            v-model="selectedSize"
            class="w-28 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-theme"
          >
            <option
              v-for="size in sizes"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>

        <!-- Button -->
        <button
          @click="handleAddToBag"
          class="mt-6 sm:mt-10 bg-theme px-10 py-3 text-white font-medium uppercase tracking-wide hover:opacity-90 transition"
        >
          Add to Bag
        </button>
      </div>
    </div>
  </div>
</template>