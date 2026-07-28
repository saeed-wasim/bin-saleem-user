<script setup>
const helpLinks = [
  { label: "Jewellery Care", to: "/jewellery-care" },
  { label: "After Sales Service", to: "/after-sales-service" },
  { label: "About Us", to: "/about-us" },
  { label: "Exchange Policy", to: "/exchange-policy" },
  { label: "Order & Shipping", to: "/order-shipping" },
  { label: "Stores", to: "/stores" },
];
</script>

<template>
  <footer class="bg-white border-t border-gray-100">
    <div
      class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10"
    >
      <div>
        <NuxtLink
          to="/"
          class="font-serif italic text-2xl sm:text-3xl tracking-tight"
        >
          <span class="text-gray-500">Bin Saleem </span>
          <span class="text-theme">Jewelley</span>
        </NuxtLink>

        <div class="flex items-center gap-3 mt-5">
          <a
            href="#"
            aria-label="Instagram"
            class="w-9 h-9 rounded-md bg-gray-900 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            class="w-9 h-9 rounded-md bg-gray-900 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.6 14.2 3.6c-2.5 0-4.2 1.5-4.2 4.3v2H7.3V13H10v8h3.5Z"
              />
            </svg>
          </a>
        </div>

        <div class="mt-5 text-sm text-gray-500 space-y-1.5">
          <p>Contact Us: 042-111 801 802</p>
          <p>Email: wecare@binsaleemjewellery.pk</p>
          <p>Address: 3-Z DHA Lahore</p>
          <p>Available From: 11:00 AM to 7:00 PM (Mon-Sat)</p>
        </div>
      </div>

      <div>
        <h3
          class="text-sm font-bold tracking-wide text-gray-900 uppercase mb-4"
        >
          Help
        </h3>
        <ul class="space-y-2.5 text-sm text-gray-500">
          <li v-for="link in helpLinks" :key="link.to">
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

    <div class="bg-gray-100 py-4">
      <p class="text-center text-xs sm:text-sm text-gray-500">
        Copyright &copy; {{ new Date().getFullYear() }} Bin Saleem
        Jewellery&reg;. All rights reserved.
      </p>
    </div>
  </footer>
</template>
