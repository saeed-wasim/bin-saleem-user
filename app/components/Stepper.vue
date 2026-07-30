<script setup>
const props = defineProps({
  // [{ key: 'summary', label: 'Summary', time: '' }, ...] — time is optional.
  steps: {
    type: Array,
    required: true,
  },
  current: {
    type: String,
    required: true,
  },
  // Order tracking uses this stepper read-only; checkout uses it to jump steps.
  clickable: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['select'])

const currentIndex = computed(() => {
  const idx = props.steps.findIndex((s) => s.key === props.current)
  return idx === -1 ? 0 : idx
})

const progressPercent = computed(() =>
  props.steps.length > 1 ? (currentIndex.value / (props.steps.length - 1)) * 100 : 0
)
</script>

<template>
  <nav class="relative flex justify-between">
    <div class="absolute top-4 left-0 right-0 h-px bg-gray-200">
      <div
        class="h-px bg-theme transition-all duration-500"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <component
      :is="clickable ? 'button' : 'div'"
      v-for="(step, index) in steps"
      :key="step.key"
      type="button"
      class="relative z-10 flex flex-col items-center gap-2"
      @click="clickable && $emit('select', step.key)"
    >
      <span
        class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors"
        :class="index <= currentIndex
          ? 'bg-theme border-theme text-white'
          : 'bg-white border-gray-300 text-gray-400'"
      >
        <span v-if="index < currentIndex">&#10003;</span>
        <span v-else>{{ index + 1 }}</span>
      </span>
      <span class="text-center">
        <span
          class="block text-xs uppercase tracking-wider font-semibold whitespace-nowrap"
          :class="index <= currentIndex ? 'text-theme' : 'text-gray-400'"
        >
          {{ step.label }}
        </span>
        <span v-if="step.time" class="block text-[11px] text-gray-400 mt-0.5">{{ step.time }}</span>
      </span>
    </component>
  </nav>
</template>
