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

const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const config = useRuntimeConfig()
const { loginWithGoogle, loginWithPassword, register } = useAuth()

let scriptLoading = false

function resetForm() {
  name.value = ''
  email.value = ''
  password.value = ''
  showPassword.value = false
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = null
}

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    if (mode.value === 'register') {
      await register(name.value, email.value, password.value)
    } else {
      await loginWithPassword(email.value, password.value)
    }
    resetForm()
    emit('close')
  } catch (err) {
    error.value = err?.data?.error || err?.message || 'Sign-in failed'
  } finally {
    loading.value = false
  }
}

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
    if (!visible) {
      mode.value = 'login'
      resetForm()
      return
    }
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
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
            <h2 class="text-xl font-semibold text-gray-800">Login</h2>

            <button
              type="button"
              aria-label="Close"
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Center Content -->
          <div class="flex-1 flex items-center justify-center px-6">
            <div class="w-full max-w-xs">
              <p
                v-if="loading"
                class="text-sm text-gray-500 mb-4 text-center"
              >
                Signing you in...
              </p>

              <p
                v-if="error"
                class="text-sm text-red-600 mb-4 text-center"
              >
                {{ error }}
              </p>

              <form
                class="space-y-3 mb-4"
                @submit.prevent="handleSubmit"
              >
                <input
                  v-if="mode === 'register'"
                  v-model="name"
                  type="text"
                  placeholder="Full name"
                  autocomplete="name"
                  required
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  autocomplete="email"
                  required
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                    :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
                    required
                    minlength="8"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                  <button
                    type="button"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    @click="showPassword = !showPassword"
                  >
                    <svg
                      v-if="showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full rounded-md bg-gray-900 text-white text-sm font-medium py-2 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {{ mode === 'register' ? 'Create account' : 'Log in' }}
                </button>
              </form>

              <p class="text-sm text-gray-500 text-center mb-4">
                <template v-if="mode === 'register'">
                  Already have an account?
                  <button type="button" class="text-gray-900 font-medium underline" @click="toggleMode">
                    Log in
                  </button>
                </template>
                <template v-else>
                  New here?
                  <button type="button" class="text-gray-900 font-medium underline" @click="toggleMode">
                    Create an account
                  </button>
                </template>
              </p>

              <div class="flex items-center gap-3 mb-4">
                <div class="h-px flex-1 bg-gray-200" />
                <span class="text-xs text-gray-400 uppercase">or</span>
                <div class="h-px flex-1 bg-gray-200" />
              </div>

             <div class="px-5">
               <div
                ref="googleButton"
                class="flex justify-center w-full "
              />
             </div>
            </div>
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
