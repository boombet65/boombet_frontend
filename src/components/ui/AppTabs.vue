<template>
    <div>
      <!-- Tab bar -->
      <div class="flex border-b border-cyan-800/60 overflow-x-auto" style="scrollbar-width:none;">
        <button
          v-for="tab in tabs" :key="tab.key"
          class="flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all duration-200"
          :class="modelValue === tab.key
            ? 'text-yellow-400 border-yellow-400'
            : 'text-cyan-600 border-transparent hover:text-cyan-300'"
          @click="$emit('update:modelValue', tab.key)"
        >
          <span v-if="tab.icon">{{ tab.icon }}</span>
          {{ tab.label }}
          <span v-if="tab.count !== undefined"
                class="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                :class="modelValue === tab.key ? 'bg-yellow-400/15 text-yellow-400' : 'bg-cyan-800 text-cyan-500'">
            {{ tab.count }}
          </span>
        </button>
      </div>
  
      <!-- Tab content -->
      <slot />
    </div>
  </template>
  
  <script setup>
  defineProps({
    tabs:       { type: Array, required: true }, // [{ key, label, icon?, count? }]
    modelValue: { type: String, required: true },
  })
  defineEmits(['update:modelValue'])
  </script>