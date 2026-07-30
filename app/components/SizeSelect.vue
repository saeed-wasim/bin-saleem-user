<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function select(size) {
  emit("update:modelValue", size);
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="size in options"
      :key="size"
      type="button"
      class="relative min-w-[2.75rem] h-11 px-3 rounded-lg border text-sm font-medium transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-theme focus-visible:ring-offset-1"
      :class="
        modelValue === size
          ? 'bg-theme border-theme text-white shadow-md shadow-theme/30 scale-105'
          : 'border-gray-300 text-gray-700 hover:border-theme hover:text-theme hover:-translate-y-0.5'
      "
      :aria-pressed="modelValue === size"
      @click="select(size)"
    >
      {{ size }}
    </button>
  </div>
</template>
