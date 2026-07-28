<script setup>
const searchQuery = ref('')
const { isOpen: showLoginDrawer, open: openLoginDrawer, close: closeLoginDrawer } = useLoginDrawer()
const showMobileMenu = ref(false)

const { user, isAuthenticated, loadFromStorage } = useAuth()
const { items: cartItems, loadFromStorage: loadCartFromStorage } = useCart()
const { items: wishlistItems, ensureLoaded: ensureWishlistLoaded } = useWishlist()
const firstName = computed(() => user.value?.name?.split(' ')[0] || '')
const cartCount = computed(() => cartItems.value.reduce((n, i) => n + i.qty, 0))
const wishlistCount = computed(() => wishlistItems.value.length)

onMounted(() => {
  loadFromStorage()
  loadCartFromStorage()
  ensureWishlistLoaded()
})

const router = useRouter()
const route = useRoute()

function goToSearch(q) {
  const onSearchPage = route.path === '/categories' && !!route.query.search
  router[onSearchPage ? 'replace' : 'push']({ path: '/categories', query: { search: q } })
}

function handleSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  goToSearch(q)
}

let searchDebounce = null
watch(searchQuery, (value) => {
  clearTimeout(searchDebounce)
  const q = value.trim()
  if (!q) return
  searchDebounce = setTimeout(() => goToSearch(q), 400)
})

onBeforeUnmount(() => clearTimeout(searchDebounce))
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
    <div class="bg-black text-white text-sm py-2 text-center tracking-wide overflow-hidden text-ellipsis whitespace-nowrap px-2">
      Free Shipping&nbsp;&nbsp;|&nbsp;&nbsp;Best Prices Since 2009!&nbsp;&nbsp;|&nbsp;&nbsp;<NuxtLink to="/dashboard" class="text-white hover:underline">Stores</NuxtLink>
    </div>

    <!-- Mobile header: two rows, no search -->
    <div class="sm:hidden px-4 py-3 space-y-3">
      <div class="flex items-center justify-between">
        <button
          type="button"
          aria-label="Open menu"
          class="text-gray-700 hover:text-theme"
          @click="showMobileMenu = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <NuxtLink to="/" class="font-serif italic text-lg tracking-tight">
          <span class="text-gray-500">Bin Saleem </span><span class="text-theme">Jewelley</span>
        </NuxtLink>
      </div>

      <div class="flex items-center justify-between">
        <NuxtLink to="/wishlist" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-theme">
          <span class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ wishlistCount }}
            </span>
          </span>
          Wishlist
        </NuxtLink>

        <NuxtLink to="/bag" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-theme">
          <span class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </span>
          Cart
        </NuxtLink>
      </div>
    </div>

    <!-- Desktop header: single row with search -->
    <div class="hidden sm:flex max-w-7xl mx-auto px-6 py-3 items-center gap-6">
      <NuxtLink to="/" class="shrink-0 font-serif italic text-3xl tracking-tight">
        <span class="text-gray-500">Bin Saleem </span> <br><span class="text-theme">Jewelley</span>
      </NuxtLink>

      <form class="flex flex-1 min-w-0" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Products"
          class="min-w-0 flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-theme"
        />
        <button
          type="submit"
          aria-label="Search"
          class="shrink-0 bg-theme hover:opacity-90 transition-opacity text-white px-5 rounded-r flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <nav class="flex items-center gap-4 text-sm shrink-0 whitespace-nowrap">
        <ClientOnly>
          <NuxtLink
            v-if="isAuthenticated"
            to="/account"
            class="hover:text-theme"
          >
            Hi, <span class="text-theme font-semibold uppercase">{{ firstName }}</span>
          </NuxtLink>
          <template v-else>
            <button type="button" class="hover:text-theme" @click="openLoginDrawer">Login</button>
          </template>

          <template #fallback>
            <button type="button" class="hover:text-theme" @click="openLoginDrawer">Login</button>
          </template>
        </ClientOnly>

        <NuxtLink to="/wishlist" aria-label="Wishlist" class="relative hover:text-theme">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <span
            v-if="wishlistCount > 0"
            class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ wishlistCount }}
          </span>
        </NuxtLink>

        <NuxtLink to="/bag" class="relative hover:text-theme flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
            {{ cartCount }}
          </span>
          <span>Cart</span>
        </NuxtLink>
      </nav>
    </div>

    <LoginDrawer :show="showLoginDrawer" @close="closeLoginDrawer" />
    <MobileMenu :show="showMobileMenu" @close="showMobileMenu = false" />
  </header>
</template>
