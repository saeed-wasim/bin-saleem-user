<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
})

const emit = defineEmits(['close'])

const { user, isAuthenticated, logout } = useAuth()
const { open: openLoginDrawer } = useLoginDrawer()
const router = useRouter()

const firstName = computed(() => user.value?.name?.split(' ')[0] || '')

const shopLinks = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/categories' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Best Sellers', to: '/best-sellers' },
  { label: 'Gift Guide', to: '/gift-guide' },
  { label: 'Stores', to: '/dashboard' },
]

const accountLinks = [
  { label: 'My Account', to: '/account' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Cart', to: '/bag' },
]

const helpLinks = [
  { label: 'Jewellery Care', to: '/jewellery-care' },
  { label: 'After Sales Service', to: '/after-sales-service' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Exchange Policy', to: '/exchange-policy' },
  { label: 'Order & Shipping', to: '/order-shipping' },
  { label: 'Store Locations', to: '/stores' },
  { label: 'Contact Us', to: '/contact-us' },
]

function close() {
  emit('close')
}

function handleLogin() {
  close()
  openLoginDrawer()
}

function handleLogout() {
  logout()
  close()
  router.push('/')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[70] bg-black/40 sm:hidden" @click.self="close" />
    </Transition>

    <Transition name="slide">
      <aside
        v-if="show"
        class="fixed left-0 top-0 z-[80] h-screen w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col sm:hidden"
      >
        <div class="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
          <span class="font-serif italic text-xl tracking-tight">
            <span class="text-gray-500">Bin Saleem </span><span class="text-theme">Jewelley</span>
          </span>
          <button type="button" aria-label="Close menu" class="text-gray-400 hover:text-gray-600" @click="close">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ClientOnly>
          <div class="px-5 py-4 border-b border-gray-100 bg-themeSoft">
            <template v-if="isAuthenticated">
              <p class="text-sm text-gray-500">Hi, <span class="font-semibold text-theme uppercase">{{ firstName }}</span></p>
              <button type="button" class="mt-1 text-xs text-gray-500 hover:text-theme" @click="handleLogout">Sign Out</button>
            </template>
            <button v-else type="button" class="text-sm font-semibold text-theme" @click="handleLogin">
              Log In / Sign Up
            </button>
          </div>
        </ClientOnly>

        <nav class="flex-1 overflow-y-auto py-3">
          <ul class="space-y-0.5 px-2">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-themeSoft hover:text-theme transition-colors"
                @click="close"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <p class="px-5 mt-5 mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">My Account</p>
          <ul class="space-y-0.5 px-2">
            <li v-for="link in accountLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-themeSoft hover:text-theme transition-colors"
                @click="close"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <p class="px-5 mt-5 mb-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">Help</p>
          <ul class="space-y-0.5 px-2 pb-4">
            <li v-for="link in helpLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-themeSoft hover:text-theme transition-colors"
                @click="close"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
