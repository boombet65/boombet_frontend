<!-- AppToast.vue  -->
<template>
    <div
      class="absolute top-3 left-3 right-3 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold shadow-lg"
      :class="toast.type === 'success'
        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
        : 'bg-red-500/20 border border-red-500/40 text-red-400'">
      <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
      {{ toast.message }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    toast: { type: Object, required: true }
  })
  </script>