<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: true },
  size: { type: String, default: 'w-5 h-5' },
})

const emit = defineEmits(['update:modelValue'])

const hovered = ref(0)

function displayValue(star) {
  const value = props.readonly ? props.modelValue : (hovered.value || props.modelValue)
  return star <= value
}

function select(star) {
  if (props.readonly) return
  emit('update:modelValue', star)
}
</script>

<template>
  <div class="inline-flex items-center gap-0.5" @mouseleave="hovered = 0">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      class="text-amber-400"
      :class="readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'"
      @click="select(star)"
      @mouseenter="!readonly && (hovered = star)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" :class="size" viewBox="0 0 24 24" :fill="displayValue(star) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.7l7.1-.6L12 2.5Z" />
      </svg>
    </button>
  </div>
</template>
