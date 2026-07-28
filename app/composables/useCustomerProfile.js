export const useCustomerProfile = () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchMe = async () => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch('/api/customers/me', {
        baseURL: config.public.apiBaseUrl,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      profile.value = response
      return response
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        await useAuth().sessionExpired()
      }
      error.value = err.data?.error || err.message || 'Failed to fetch profile'
      console.error('Error fetching profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMe = async (data) => {
    try {
      loading.value = true
      error.value = null
      const config = useRuntimeConfig()
      const { token } = useAuth()
      const response = await $fetch('/api/customers/me', {
        baseURL: config.public.apiBaseUrl,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: data,
      })
      profile.value = response
      return response
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        await useAuth().sessionExpired()
      }
      error.value = err.data?.error || err.message || 'Failed to update profile'
      console.error('Error updating profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchMe,
    updateMe,
  }
}
