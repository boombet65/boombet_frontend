<!-- AppModal.vue  -->

<template>
    
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modelValue"
             class="fixed inset-0 z-[200] flex items-center justify-center p-4"
             style="background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);"
             @click.self="closable && $emit('update:modelValue', false)">
          <Transition name="scale-in">
            <div v-if="modelValue"
                 class="w-full bg-cyan-950 border border-cyan-800 rounded-2xl shadow-2xl overflow-hidden"
                 :style="{ maxWidth: maxWidth }">
              <!-- Header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-cyan-800/60">
                <h3 class="font-bold text-cyan-100 text-base">{{ title }}</h3>
                <button v-if="closable"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-cyan-500 hover:bg-cyan-800 hover:text-cyan-200 transition-colors"
                        @click="$emit('update:modelValue', false)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <!-- Body -->
              <div class="p-5"><slot /></div>
              <!-- Footer -->
              <div v-if="$slots.footer" class="px-5 pb-5"><slot name="footer" /></div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  defineProps({
    modelValue: { type: Boolean, default: false },
    title:      { type: String, default: '' },
    maxWidth:   { type: String, default: '480px' },
    closable:   { type: Boolean, default: true },
  })
  defineEmits(['update:modelValue'])
  </script>