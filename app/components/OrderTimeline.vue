<script setup>
const props = defineProps({
  fulfillmentStatus: { type: String, default: 'Processing' },
  createdAt: { type: String, default: '' },
  shippedAt: { type: String, default: '' },
  deliveredAt: { type: String, default: '' },
})

function formatTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const steps = computed(() => [
  { key: 'Processing', label: 'Order Placed', time: formatTime(props.createdAt) },
  { key: 'Shipped', label: 'Shipped', time: formatTime(props.shippedAt) },
  { key: 'Delivered', label: 'Delivered', time: formatTime(props.deliveredAt) },
])
</script>

<template>
  <div class="py-2">
    <Stepper :steps="steps" :current="fulfillmentStatus" :clickable="false" />
  </div>
</template>
