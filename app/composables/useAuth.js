const TOKEN_KEY = 'bs_customer_token'
const USER_KEY = 'bs_customer_user'

export function useAuth() {
  const token = useState('customer-auth-token', () => null)
  const user = useState('customer-auth-user', () => null)

  function loadFromStorage() {
    if (import.meta.client && token.value === null) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)
      token.value = storedToken || ''
      user.value = storedUser ? JSON.parse(storedUser) : null
    }
  }

  async function loginWithGoogle(idToken) {
    const config = useRuntimeConfig()
    const response = await $fetch('/api/auth/google', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: { idToken },
    })

    token.value = response.token
    user.value = response.user

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      useCart().adoptCustomer(response.user.id)
      useWishlist().fetchWishlist()
    }

    return response
  }

  function logout() {
    token.value = ''
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }

    useCart().reset()
    useWishlist().reset()
  }

  // Clears a stale/invalid token and sends the customer back to login so a
  // fresh one is issued, instead of leaving them stuck on repeated 401s.
  async function sessionExpired(redirectPath) {
    logout()
    if (import.meta.client) {
      const path = redirectPath || useRoute().fullPath
      await navigateTo(`/login?redirect=${encodeURIComponent(path)}&reason=session`)
    }
  }

  return {
    token,
    user,
    isAuthenticated: computed(() => !!token.value),
    loadFromStorage,
    loginWithGoogle,
    logout,
    sessionExpired,
  }
}
