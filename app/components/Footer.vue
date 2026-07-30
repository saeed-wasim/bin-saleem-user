<script setup>
const quickLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Shipping & Returns", to: "/shipping-returns" },
  { label: "Contact Us", to: "/contact-us" },
];
</script>

<template>
  <footer class="bg-white border-t border-gray-100">
    <div
      class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10"
    >
      <div>
        <NuxtLink to="/" class="font-serif italic text-3xl tracking-tight">
          <span class="text-gray-500">Bin Saleem </span
          ><span class="text-theme">Jewelley</span>
        </NuxtLink>
        <p class="text-sm text-gray-500 mt-3 leading-relaxed">
          Crafting timeless elegance since 2009. Experience the pinnacle of
          luxury and craftsmanship.
        </p>
      </div>

      <div>
        <h3 class="text-xs font-bold uppercase tracking-wide text-theme mb-4">
          Contact Us
        </h3>
        <ul class="space-y-3 text-sm text-gray-600">
          <li class="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-theme shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M3 5a2 2 0 012-2h2.28a1 1 0 01.98.8l.72 3.6a1 1 0 01-.5 1.1l-1.5.86a12 12 0 006 6l.86-1.5a1 1 0 011.1-.5l3.6.72a1 1 0 01.8.98V19a2 2 0 01-2 2h-1C9.4 21 3 14.6 3 6V5z"
              />
            </svg>
            042-111 801 802
          </li>
          <li class="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-theme shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            wecare@binsaleemjewellery.pk
          </li>
          <li class="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-theme shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            3-Z DHA Lahore
          </li>
          <li class="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-theme shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            11:00 AM to 7:00 PM (Mon-Sat)
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xs font-bold uppercase tracking-wide text-theme mb-4">
          Quick Links
        </h3>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
          <li v-for="link in quickLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              target="_blank"
              class="hover:text-theme transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <p class="text-xs sm:text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} Bin Saleem Jewellery. All Rights
          Reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
