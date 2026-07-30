<script setup>
const searchQuery = ref("");
const {
  isOpen: showLoginDrawer,
  open: openLoginDrawer,
  close: closeLoginDrawer,
} = useLoginDrawer();
const showMobileMenu = ref(false);
const showMobileSearch = ref(false);

const { user, isAuthenticated, loadFromStorage } = useAuth();
const { items: cartItems, loadFromStorage: loadCartFromStorage } = useCart();
const { items: wishlistItems, ensureLoaded: ensureWishlistLoaded } =
  useWishlist();
const firstName = computed(() => user.value?.name?.split(" ")[0] || "");
const cartCount = computed(() =>
  cartItems.value.reduce((n, i) => n + i.qty, 0),
);
const wishlistCount = computed(() => wishlistItems.value.length);

onMounted(() => {
  loadFromStorage();
  loadCartFromStorage();
  ensureWishlistLoaded();
});

const router = useRouter();
const route = useRoute();

function goToSearch(q) {
  const onSearchPage = route.path === "/categories" && !!route.query.search;
  router[onSearchPage ? "replace" : "push"]({
    path: "/categories",
    query: { search: q },
  });
}

function handleSearch() {
  const q = searchQuery.value.trim();
  if (!q) return;
  goToSearch(q);
  showMobileSearch.value = false;
}

function clearSearch() {
  searchQuery.value = "";
  showMobileSearch.value = false;
  router.push("/dashboard");
}

let searchDebounce = null;
watch(searchQuery, (value) => {
  clearTimeout(searchDebounce);
  const q = value.trim();
  if (!q) return;
  searchDebounce = setTimeout(() => goToSearch(q), 400);
});

onBeforeUnmount(() => clearTimeout(searchDebounce));

const mainNavLinks = [
  { label: "Collections", to: "/categories" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Best Sellers", to: "/best-sellers" },
  { label: "Gift Guide", to: "/gift-guide" },
];
</script>

<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm">
   <div class="bg-themeSoft text-theme text-xs sm:text-sm">
  <div class="w-full flex justify-center overflow-hidden">
    <div
      class="w-[40%] flex items-center justify-center py-2 animate-marquee"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 mr-2 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <rect x="1" y="7" width="14" height="10" rx="1" />
        <path d="M15 10h4l3 3v4a1 1 0 0 1-1 1h-2" />
        <circle cx="6.5" cy="19.5" r="1.5" />
        <circle cx="17.5" cy="19.5" r="1.5" />
      </svg>

      <span class="uppercase tracking-wide text-xs whitespace-nowrap">
        Free Shipping on All Orders
      </span>
    </div>
  </div>
</div>

    <!-- Mobile header: single row — hamburger, logo, search toggle. Everything
         else (account, wishlist, cart, help links) lives in the sidebar. -->
    <div class="sm:hidden px-4 py-3 flex items-center justify-between">
      <button
        type="button"
        aria-label="Open menu"
        class="text-gray-700 hover:text-theme"
        @click="showMobileMenu = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <NuxtLink
        to="/"
        class="font-serif italic text-lg leading-tight text-center tracking-tight"
      >
        <span class="block text-gray-500">Bin Saleem</span>
        <span class="block text-theme">Jewellery</span>
      </NuxtLink>

      <button
        type="button"
        aria-label="Search"
        class="text-gray-700 hover:text-theme"
        @click="showMobileSearch = !showMobileSearch"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>

    <div v-if="showMobileSearch" class="sm:hidden px-4 pb-3">
      <form class="flex" @submit.prevent="handleSearch">
        <div class="relative min-w-0 flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search our collection..."
            autofocus
            class="w-full border border-gray-300 rounded-l px-4 py-2 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-theme"
          />
          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme"
            @click="clearSearch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          aria-label="Search"
          class="shrink-0 bg-theme hover:opacity-90 transition-opacity text-white px-4 rounded-r flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </div>

    <!-- Desktop header: search / logo / icons, logo always centered -->
    <div
      class="hidden sm:grid grid-cols-[1fr_auto_1fr] max-w-7xl mx-auto px-6 py-2 items-center gap-6"
    >
      <form class="flex w-full max-w-xs" @submit.prevent="handleSearch">
        <div class="relative min-w-0 flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search our collection..."
            class="w-full border border-gray-300 rounded-l px-4 py-2 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-theme"
          />
          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-theme"
            @click="clearSearch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          aria-label="Search"
          class="shrink-0 bg-theme hover:opacity-90 transition-opacity text-white px-4 rounded-r flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <NuxtLink
        to="/"
        class="justify-self-center shrink-0 font-serif italic text-3xl tracking-tight text-center"
      >
        <span class="text-gray-500">Bin Saleem </span> <br /><span
          class="text-theme"
          >Jewellery</span
        >
      </NuxtLink>

      <nav
        class="justify-self-end flex items-center gap-5 text-sm shrink-0 whitespace-nowrap"
      >
        <ClientOnly>
          <NuxtLink
            v-if="isAuthenticated"
            to="/account"
            class="hover:text-theme transition-colors"
          >
            Hi,
            <span class="text-theme font-semibold uppercase">{{
              firstName
            }}</span>
          </NuxtLink>
          <button
            v-else
            type="button"
            aria-label="Login"
            class="hover:text-theme transition-colors"
            @click="openLoginDrawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21a8 8 0 10-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          <template #fallback>
            <button
              type="button"
              aria-label="Login"
              class="hover:text-theme transition-colors"
              @click="openLoginDrawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21a8 8 0 10-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </template>
        </ClientOnly>

        <NuxtLink
          to="/wishlist"
          aria-label="Wishlist"
          class="relative hover:text-theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
            />
          </svg>
          <span
            v-if="wishlistCount > 0"
            class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ wishlistCount }}
          </span>
        </NuxtLink>

        <NuxtLink to="/bag" aria-label="Cart" class="relative hover:text-theme">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"
            />
          </svg>
          <span
            v-if="cartCount > 0"
            class="absolute -top-2 -right-2 bg-theme text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </NuxtLink>
      </nav>
    </div>

    <nav
      class="hidden sm:flex items-center justify-center gap-8 border-gray-100 text-xs uppercase tracking-wide"
    >
      <NuxtLink
        v-for="link in mainNavLinks"
        :key="link.to"
        :to="link.to"
        class="pb-1 border-b-2 transition-colors"
        :class="
          route.path === link.to
            ? 'text-theme font-semibold border-theme'
            : 'text-gray-600 border-transparent hover:text-theme'
        "
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <LoginDrawer :show="showLoginDrawer" @close="closeLoginDrawer" />
    <MobileMenu :show="showMobileMenu" @close="showMobileMenu = false" />
  </header>
</template>

<style scoped>
.animate-marquee {
  animation: marquee-scroll 5s linear infinite;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
