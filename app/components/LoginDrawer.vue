<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const error = ref(null)
const loading = ref(false)
const googleButton = ref(null)

const config = useRuntimeConfig()
const { loginWithGoogle } = useAuth()

let scriptLoading = false

async function handleGoogleCredential(response) {
  error.value = null
  loading.value = true
  try {
    await loginWithGoogle(response.credential)
    emit('close')
  } catch (err) {
    error.value = err?.data?.error || err?.message || 'Google sign-in failed'
  } finally {
    loading.value = false
  }
}

function renderGoogleButton() {
  if (!window.google || !googleButton.value) return
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

function loadGoogleButton() {
  if (!config.public.googleClientId) return

  if (window.google?.accounts?.id) {
    renderGoogleButton()
    return
  }

  if (scriptLoading) return
  scriptLoading = true

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = renderGoogleButton
  document.head.appendChild(script)
}

watch(
  () => props.show,
  async (visible) => {
    if (!visible) return
    error.value = null
    await nextTick()
    loadGoogleButton()
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="show"
        class="fixed inset-0 z-[70] flex items-center justify-end bg-black/40"
        @click.self="emit('close')"
      >
        <div class="bg-white h-screen w-full max-w-md shadow-2xl flex flex-col">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-800">Login</h2>
            <button
              type="button"
              aria-label="Close"
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex-1 overflow-y-auto">
            <p v-if="loading" class="text-sm text-gray-500 text-center mb-4">Signing you in...</p>
            <p v-if="error" class="text-sm text-red-600 text-center mb-4">{{ error }}</p>

            <div ref="googleButton" class="flex justify-center" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active > div,
.drawer-leave-active > div {
  transition: transform 0.3s ease;
}

.drawer-enter-from > div,
.drawer-leave-to > div {
  transform: translateX(100%);
}
</style>
