<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Back',
  },
})

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-theme transition-colors"
    @click="goBack"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
    {{ label }}
  </button>
</template>
