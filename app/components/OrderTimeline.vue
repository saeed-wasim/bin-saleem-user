<script setup>
const props = defineProps({
  fulfillmentStatus: { type: String, default: 'Processing' },
  createdAt: { type: String, default: '' },
  shippedAt: { type: String, default: '' },
  deliveredAt: { type: String, default: '' },
})

const steps = ['Processing', 'Shipped', 'Delivered']
const labels = { Processing: 'Order Placed', Shipped: 'Shipped', Delivered: 'Delivered' }

const currentIndex = computed(() => {
  const idx = steps.indexOf(props.fulfillmentStatus)
  return idx === -1 ? 0 : idx
})

const progressPercent = computed(() => (currentIndex.value / (steps.length - 1)) * 100)

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function stepTime(index) {
  if (index === 0) return formatTime(props.createdAt)
  if (index === 1) return formatTime(props.shippedAt)
  if (index === 2) return formatTime(props.deliveredAt)
  return ''
}
</script>

<template>
  <div class="py-2">
    <div class="relative flex justify-between">
      <div class="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full">
        <div
          class="h-1 bg-theme rounded-full transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <div
        v-for="(step, index) in steps"
        :key="step"
        class="relative z-10 flex flex-col items-center gap-2"
        :style="{ width: `${100 / steps.length}%` }"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors"
          :class="index <= currentIndex
            ? 'bg-theme border-theme text-white'
            : 'bg-white border-gray-300 text-gray-400'"
        >
          <span v-if="index < currentIndex">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="text-center">
          <p
            class="text-xs sm:text-sm font-semibold"
            :class="index <= currentIndex ? 'text-gray-900' : 'text-gray-400'"
          >
            {{ labels[step] }}
          </p>
          <p v-if="stepTime(index)" class="text-[11px] text-gray-400 mt-0.5">{{ stepTime(index) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
