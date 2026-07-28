<script setup>
const searchQuery = ref('')
const { isOpen: showLoginDrawer, open: openLoginDrawer, close: closeLoginDrawer } = useLoginDrawer()

const { user, isAuthenticated, loadFromStorage } = useAuth()
const { items: cartItems, loadFromStorage: loadCartFromStorage } = useCart()
const firstName = computed(() => user.value?.name?.split(' ')[0] || '')
const cartCount = computed(() => cartItems.value.reduce((n, i) => n + i.qty, 0))

onMounted(() => {
  loadFromStorage()
  loadCartFromStorage()
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="bg-black text-white text-sm py-2 text-center tracking-wide overflow-hidden text-ellipsis whitespace-nowrap px-2">
      Free Shipping&nbsp;&nbsp;|&nbsp;&nbsp;Best Prices Since 2009!&nbsp;&nbsp;|&nbsp;&nbsp;<NuxtLink to="/dashboard" class="text-white hover:underline">Stores</NuxtLink>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-6">
      <NuxtLink to="/" class="shrink-0 font-serif italic text-2xl sm:text-3xl tracking-tight">
        <span class="text-gray-500">Bin Saleem </span> <br><span class="text-theme">Jewelley</span>
      </NuxtLink>

      <form class="flex flex-1 min-w-0" @submit.prevent>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Products"
          class="min-w-0 flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-theme"
        />
        <button
          type="submit"
          aria-label="Search"
          class="shrink-0 bg-theme hover:opacity-90 transition-opacity text-white px-4 sm:px-5 rounded-r flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <nav class="flex items-center gap-3 sm:gap-4 text-sm shrink-0 whitespace-nowrap">
        <ClientOnly>
          <NuxtLink
            v-if="isAuthenticated"
            to="/account"
            class="hidden sm:inline hover:text-theme"
          >
            Hi, <span class="text-theme font-semibold uppercase">{{ firstName }}</span>
          </NuxtLink>
          <template v-else>
            <button type="button" class="hidden sm:inline hover:text-theme" @click="openLoginDrawer">Login</button>
          </template>

          <template #fallback>
            <button type="button" class="hidden sm:inline hover:text-theme" @click="openLoginDrawer">Login</button>
          </template>
        </ClientOnly>

        <button type="button" aria-label="Wishlist" class="hover:text-theme">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>

        <NuxtLink to="/bag" class="relative hover:text-theme flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
            {{ cartCount }}
          </span>
          <span class="hidden sm:inline">Cart</span>
        </NuxtLink>
      </nav>
    </div>

    <LoginDrawer :show="showLoginDrawer" @close="closeLoginDrawer" />
  </header>
</template>
