<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      :class="[sizeClass, variantClass, block ? 'w-full' : '']"
      @click="$emit('click', $event)"
    >
      <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <slot />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: { type: String, default: 'primary' }, // primary | secondary | ghost | danger | success
    size:    { type: String, default: 'md' },       // sm | md | lg
    type:    { type: String, default: 'button' },
    disabled:{ type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    block:   { type: Boolean, default: false },
  })
  
  defineEmits(['click'])
  
  const variantClass = computed(() => ({
    primary:   'bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 hover:-translate-y-px active:translate-y-0 shadow-lg shadow-yellow-500/20',
    secondary: 'bg-transparent border border-cyan-700 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200',
    ghost:     'bg-transparent text-cyan-400 hover:bg-cyan-800/50 hover:text-cyan-200',
    danger:    'bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 hover:-translate-y-px',
    success:   'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:opacity-90 hover:-translate-y-px shadow-lg shadow-green-500/20',
  }[props.variant]))
  
  const sizeClass = computed(() => ({
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  }[props.size]))
  </script>