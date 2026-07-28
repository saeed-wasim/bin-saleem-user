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
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
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

        <div class="mx-auto w-14 h-14 rounded-full border-2 border-theme flex items-center justify-center text-theme">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke-width="1.5" />
            <path stroke-linecap="round" stroke-width="1.5" d="M2 10h20" />
            <path stroke-linecap="round" stroke-width="1.5" d="M6 15h4" />
          </svg>
        </div>

        <h2 class="font-serif font-bold text-2xl text-theme mt-5">Payment &amp; Delivery Policy</h2>

        <p class="text-sm text-gray-600 leading-relaxed mt-4">
          To maintain the highest security for our bespoke pieces, please note that
          <span class="font-semibold text-gray-900">Cash on Delivery is unavailable</span>. We
          exclusively accept secure digital card payments.
        </p>

        <div class="w-12 h-px bg-theme/30 mx-auto my-5"></div>

        <div class="flex items-center justify-center gap-2 text-theme">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h11v8H3z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10h4l3 3v2h-7z" />
            <circle cx="7" cy="17" r="1.5" stroke-width="1.5" />
            <circle cx="17" cy="17" r="1.5" stroke-width="1.5" />
          </svg>
          <span class="text-xs font-semibold uppercase tracking-wider">Complimentary Delivery Across Pakistan</span>
        </div>

        <button
          type="button"
          class="w-full mt-6 bg-theme hover:opacity-90 transition-opacity text-white text-sm font-semibold uppercase tracking-widest rounded-lg py-3"
          @click="show = false"
        >
          Understood
        </button>
      </div>
    </div>
  </Teleport>
</template>
