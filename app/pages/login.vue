<script setup>
const error = ref(null)
const loading = ref(false)
const googleButton = ref(null)

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { loginWithGoogle } = useAuth()

async function handleGoogleCredential(response) {
  error.value = null
  loading.value = true
  try {
    await loginWithGoogle(response.credential)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (err) {
    error.value = err?.data?.error || err?.message || 'Google sign-in failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!config.public.googleClientId) return

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: config.public.googleClientId,
      callback: handleGoogleCredential,
    })
    window.google.accounts.id.renderButton(googleButton.value, {
      theme: 'outline',
      size: 'large',
      width: 320,
    })
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm bg-white rounded-lg shadow p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>

      <p v-if="route.query.reason === 'session'" class="text-sm text-gray-500 text-center mb-4">
        Your session expired — please sign in again.
      </p>
      <p v-if="loading" class="text-sm text-gray-500 text-center mb-4">Signing you in...</p>
      <p v-if="error" class="text-sm text-red-600 text-center mb-4">{{ error }}</p>

      <div ref="googleButton" class="flex justify-center" />
    </div>
  </div>
</template>
