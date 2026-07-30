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
      useWishlist().adoptCustomer()
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

  // Clears a stale/invalid token and prompts for a fresh one via the login
  // drawer, right where the customer was, instead of bouncing them to a
  // separate page and losing their place (e.g. mid-checkout).
  function sessionExpired() {
    logout()
    if (import.meta.client) {
      useLoginDrawer().open()
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
