<script setup>
const router = useRouter();
const { user, logout } = useAuth();
const { items: wishlistItems, ensureLoaded: ensureWishlistLoaded } = useWishlist();
const wishlistCount = computed(() => wishlistItems.value.length);

onMounted(() => ensureWishlistLoaded());

const displayName = computed(() => user.value?.name || "");
const email = computed(() => user.value?.email || "");
const initials = computed(() =>
  displayName.value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?"
);

function handleSignOut() {
  logout();
  router.push("/");
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-10 sm:py-14">
    <BackButton class="mb-4" />

    <ClientOnly>
      <div class="rounded-2xl bg-gradient-to-r from-theme to-purple-700 px-6 py-8 sm:px-10 sm:py-10 text-white shadow-lg">
        <div class="flex items-center gap-5">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl font-bold tracking-wide"
          >
            {{ initials }}
          </div>
          <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold mb-1 truncate">Welcome, {{ displayName }}</h1>
            <p class="text-white/80 text-sm truncate">{{ email }}</p>
          </div>
        </div>
      </div>

      <template #fallback>
        <div class="rounded-2xl bg-gray-100 px-6 py-8 sm:px-10 sm:py-10 h-[104px] sm:h-[120px] animate-pulse" />
      </template>
    </ClientOnly>

    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NuxtLink to="/orders" class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-theme transition-all">
        <p class="text-sm text-gray-500">My Orders</p>
        <p class="mt-1 font-semibold text-gray-900">Track & view history</p>
      </NuxtLink>

      <NuxtLink to="/wishlist" class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-theme transition-all">
        <p class="text-sm text-gray-500">Wishlist</p>
        <p class="mt-1 font-semibold text-gray-900">
          {{ wishlistCount > 0 ? `${wishlistCount} saved item${wishlistCount === 1 ? '' : 's'}` : 'Saved items' }}
        </p>
      </NuxtLink>

      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-gray-500">Settings</p>
        <p class="mt-1 font-semibold text-gray-900">Profile & preferences</p>
      </div>
    </div>

    <div class="mt-10 flex justify-end">
      <button
        type="button"
        class="px-8 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold tracking-wide rounded-lg shadow-sm transition-colors"
        @click="handleSignOut"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>
