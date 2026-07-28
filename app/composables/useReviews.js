export function useReviews() {
  const reviews = ref([])
  const average = ref(0)
  const count = ref(0)
  const loading = ref(false)
  const error = ref(null)

  async function fetchProductReviews(productId) {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const response = await $fetch(`/api/reviews/product/${productId}`, {
        baseURL: config.public.apiBaseUrl,
      })
      reviews.value = response.reviews
      average.value = response.average
      count.value = response.count
      return response
    } catch (err) {
      error.value = err.data?.error || err.message || 'Failed to fetch reviews'
      console.error('Error fetching reviews:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyReview(productId) {
    const config = useRuntimeConfig()
    const { token } = useAuth()
    const response = await $fetch(`/api/reviews/product/${productId}/mine`, {
      baseURL: config.public.apiBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    })
    return response.review
  }

  async function submitReview({ productId, rating, comment }) {
    const config = useRuntimeConfig()
    const { token } = useAuth()
    const review = await $fetch('/api/reviews', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { productId, rating, comment },
    })
    reviews.value = [review, ...reviews.value]
    count.value += 1
    average.value = reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
    return review
  }

  return {
    reviews,
    average,
    count,
    loading,
    error,
    fetchProductReviews,
    fetchMyReview,
    submitReview,
  }
}
