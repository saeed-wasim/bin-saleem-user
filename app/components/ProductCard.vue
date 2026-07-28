<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const { isInWishlist, toggleWishlist, ensureLoaded } = useWishlist()
const wishlisted = computed(() => isInWishlist(props.product.id))
const animating = ref(false)

onMounted(() => ensureLoaded())

function handleWishlistClick() {
  animating.value = true
  toggleWishlist(props.product)
  setTimeout(() => { animating.value = false }, 300)
}

function formatPrice(price) {
  return Number(price).toLocaleString('en-IN')
}
</script>

<template>
  <div class="relative rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow bg-white overflow-hidden">
    <button
      type="button"
      class="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 hover:text-theme transition-transform"
      :class="{ 'text-theme': wishlisted, 'scale-125': animating }"
      :aria-label="wishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
      @click.stop.prevent="handleWishlistClick"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="wishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>

    <div class="aspect-square bg-gray-50 flex items-center justify-center">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-4">
      <p class="font-bold text-gray-900">Rs {{ formatPrice(product.price) }}</p>
      <p class="text-sm text-gray-500 truncate mt-1">{{ product.name }}</p>
    </div>
  </div>
</template>
