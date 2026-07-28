<script setup>
const { items, updateQty, updateSize, removeItem } = useCart()
const sizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13']
const qtys = [1, 2, 3, 4, 5]

function formatPrice(value) {
  return Number(value).toLocaleString('en-IN')
}

function itemGst(item) {
  return Math.round(item.price * item.qty * 0.03 * 100) / 100
}
</script>

<template>
  <div>
    <div
      v-for="item in items"
      :key="`${item.productId}-${item.size}`"
      class="flex gap-4 pb-6 mb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
    >
      <div class="w-24 h-24 rounded bg-gray-50 overflow-hidden shrink-0">
        <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-900">
          Rs {{ formatPrice(item.price) }}
          <span class="text-gray-500 font-normal text-sm ml-1">+ Rs {{ formatPrice(itemGst(item)) }} GST</span>
        </p>
        <p class="text-sm text-gray-700 mt-1">{{ item.name }}</p>

        <div class="flex gap-3 mt-3">
          <select
            :value="item.size"
            class="border border-gray-300 rounded px-2 py-1 text-sm"
            @change="updateSize(item.productId, item.size, $event.target.value)"
          >
            <option v-for="size in sizes" :key="size" :value="size">Size: {{ size }}</option>
          </select>
          <select
            :value="item.qty"
            class="border border-gray-300 rounded px-2 py-1 text-sm"
            @change="updateQty(item.productId, item.size, Number($event.target.value))"
          >
            <option v-for="q in qtys" :key="q" :value="q">Qty: {{ q }}</option>
          </select>
        </div>

        <button
          type="button"
          class="text-xs text-gray-500 hover:text-red-500 mt-3 underline"
          @click="removeItem(item.productId, item.size)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
