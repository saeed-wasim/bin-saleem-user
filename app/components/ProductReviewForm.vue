<script setup>
const props = defineProps({
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: null },
})

const { submitReview, fetchMyReview } = useReviews()

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)
const loadingExisting = ref(true)
const hasExistingReview = ref(false)
const wasUpdate = ref(false)
const justSubmitted = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    const existing = await fetchMyReview(props.productId)
    if (existing) {
      rating.value = existing.rating
      comment.value = existing.comment || ''
      hasExistingReview.value = true
    }
  } finally {
    loadingExisting.value = false
  }
})

watch([rating, comment], () => {
  justSubmitted.value = false
})

async function handleSubmit() {
  error.value = null
  if (rating.value < 1) {
    error.value = 'Please select a star rating'
    return
  }

  submitting.value = true
  try {
    await submitReview({ productId: props.productId, rating: rating.value, comment: comment.value.trim() || null })
    wasUpdate.value = hasExistingReview.value
    hasExistingReview.value = true
    justSubmitted.value = true
  } catch (err) {
    error.value = err?.data?.error || 'Unable to submit review'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
        <img v-if="productImage" :src="productImage" :alt="productName" class="w-full h-full object-cover" />
      </div>
      <NuxtLink :to="`/product/${productId}`" class="font-semibold text-gray-900 hover:text-theme">{{ productName }}</NuxtLink>
    </div>

    <div v-if="loadingExisting" class="text-sm text-gray-400">Loading...</div>

    <form v-else class="space-y-3" @submit.prevent="handleSubmit">
      <p v-if="hasExistingReview" class="text-xs text-gray-400">You've already reviewed this product &mdash; update it below if you'd like.</p>
      <StarRating v-model="rating" :readonly="false" size="w-7 h-7" />
      <textarea
        v-model="comment"
        rows="2"
        placeholder="Share your experience with this piece..."
        class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-theme focus:border-theme"
      />
      <p v-if="justSubmitted" class="text-sm text-green-600">{{ wasUpdate ? 'Review updated!' : 'Thanks for your review!' }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="px-5 py-2 bg-theme hover:opacity-90 transition-opacity text-white text-sm font-semibold rounded-lg disabled:opacity-50"
      >
        {{ submitting ? 'Submitting...' : (hasExistingReview ? 'Update Review' : 'Submit Review') }}
      </button>
    </form>
  </div>
</template>
