<script setup>
const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4"
      @click.self="show = false"
    >
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 sm:p-10">
        <button
          type="button"
          aria-label="Close"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          @click="show = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="space-y-4 text-gray-800 text-base sm:text-lg leading-relaxed">
          <p>Please be advised: COD (Cash on Delivery) payment option is not available.</p>
          <p>Only online card payment is accepted for orders.</p>
          <p>Delivery remains free of charge across Pakistan.</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
