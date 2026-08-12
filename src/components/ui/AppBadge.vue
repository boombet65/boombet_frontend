<template>
    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border"
          :class="variantClass">
      <slot />
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({
    variant: { type: String, default: 'default' }, // live | win | loss | open | void | hot | new | gold
  })
  const variantClass = computed(() => ({
    live:    'bg-red-500/10    text-red-400    border-red-500/25',
    win:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    loss:    'bg-red-500/10    text-red-400    border-red-500/20',
    open:    'bg-yellow-500/10 text-yellow-400  border-yellow-500/20',
    void:    'bg-cyan-900/40   text-cyan-600   border-cyan-800',
    hot:     'bg-orange-500/10 text-orange-400  border-orange-500/25',
    new:     'bg-blue-500/10   text-blue-400   border-blue-500/25',
    gold:    'bg-yellow-500/15 text-yellow-400  border-yellow-500/30',
    default: 'bg-cyan-900/40   text-cyan-400   border-cyan-800',
  }[props.variant]))
  </script>