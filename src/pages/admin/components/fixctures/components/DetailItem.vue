<template>
  <div>
    <p class="text-cyan-600 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">{{ label }}</p>
    <p class="text-white font-medium text-sm sm:text-base" v-if="!$slots.default">{{ value || 'N/A' }}</p>
    <slot v-else></slot>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: null }
})
</script>