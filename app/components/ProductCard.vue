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

// "New" mirrors the backend's New Arrivals filter — created within 7 days.
const isNew = computed(() => {
  if (!props.product.createdAt) return false
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return new Date(props.product.createdAt) >= sevenDaysAgo
})

onMounted(() => ensureLoaded())

function handleWishlistClick() {
  animating.value = true
  toggleWishlist(props.product)
  setTimeout(() => {
    animating.value = false
  }, 300)
}

function formatPrice(price) {
  return Number(price).toLocaleString('en-IN')
}
</script>

<template>
  <div class="group">
    <div class="relative rounded-xl overflow-hidden bg-gray-50 aspect-[4/5]">
      <span
        v-if="isNew"
        class="absolute top-3 left-3 z-10 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded"
      >
        New
      </span>

      <button
        type="button"
        class="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 shadow"
        :class="{ 'text-theme': wishlisted, 'scale-125': animating }"
        @click.stop.prevent="handleWishlistClick"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          :fill="wishlisted ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.5"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div class="pt-3">
      <p
        :title="product.name"
        class="font-semibold text-theme leading-tight line-clamp-2 min-h-[2.5rem] sm:line-clamp-none sm:min-h-0 sm:truncate"
      >
        {{ product.name }}
      </p>
      <p class="text-sm text-gray-500 mt-0.5">Rs {{ formatPrice(product.price) }}</p>
    </div>
  </div>
</template>