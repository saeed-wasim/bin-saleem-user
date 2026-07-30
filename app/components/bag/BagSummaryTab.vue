<script setup>
const { items, updateQty, removeItem } = useCart()

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

function itemGst(item) {
  return Math.round(item.price * item.qty * 0.03 * 100) / 100
}

function isRing(item) {
  return item.category?.toLowerCase() === 'rings'
}
</script>

<template>
  <div>
    <div
      v-for="item in items"
      :key="`${item.productId}-${item.size}`"
      class="flex gap-4 pb-6 mb-6 border-b border-gray-300 last:border-0 last:mb-0 last:pb-0"
    >
      <div class="w-24 h-24 rounded bg-gray-50 overflow-hidden shrink-0">
        <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-bold text-gray-900 truncate">{{ item.name }}</p>
            <p v-if="item.category" class="text-xs text-gray-500 mt-0.5">{{ item.category }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-xl font-bold text-theme">Rs {{ formatPrice(item.price) }}</p>
            <p class="text-xs text-gray-500 mt-0.5">+ Rs {{ formatPrice(itemGst(item)) }} GST</p>
          </div>
        </div>

        <div class="flex items-center gap-3 mt-3">
          <div v-if="isRing(item)" class="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700">
            Size: {{ item.size }}
          </div>

          <div class="inline-flex items-center border border-gray-300 rounded">
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-theme disabled:opacity-40 disabled:hover:text-gray-600"
              :disabled="item.qty <= 1"
              @click="updateQty(item.productId, item.size, item.qty - 1)"
            >
              −
            </button>
            <span class="w-8 text-center text-sm font-medium text-gray-900">{{ item.qty }}</span>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-theme"
              @click="updateQty(item.productId, item.size, item.qty + 1)"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 hover:text-red-500 mt-3"
          @click="removeItem(item.productId, item.size)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Remove
        </button>
      </div>
    </div>

    <div class="flex items-start gap-3 bg-gray-50 rounded p-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-theme shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" /><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="17.5" cy="18.5" r="1.5" />
      </svg>
      <div class="text-sm">
        <p class="font-semibold text-gray-900 text-xs uppercase tracking-wide">Complimentary Shipping</p>
        <p class="text-xs text-gray-500 mt-0.5">You've qualified for free express shipping on this order.</p>
      </div>
    </div>
  </div>
</template>
