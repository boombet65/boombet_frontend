<template>
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[300] flex flex-col gap-2 w-80">
        <Transition
          v-for="notif in notifications" :key="notif.id"
          name="slide-in-right"
          appear
        >
          <div class="flex items-start gap-3 p-4 rounded-xl border shadow-2xl"
               :class="typeClass(notif.type)">
            <span class="text-lg flex-shrink-0">{{ typeIcon(notif.type) }}</span>
            <div class="flex-1 min-w-0">
              <p v-if="notif.title" class="text-sm font-bold mb-0.5">{{ notif.title }}</p>
              <p class="text-xs opacity-80">{{ notif.message }}</p>
            </div>
            <button class="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                    @click="remove(notif.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const notifications = ref([])
  
  function typeClass(type) {
    return {
      success: 'bg-emerald-950 border-emerald-700/50 text-emerald-300',
      error:   'bg-red-950    border-red-700/50    text-red-300',
      warning: 'bg-yellow-950 border-yellow-700/50 text-yellow-300',
      info:    'bg-cyan-950   border-cyan-700/50   text-cyan-300',
    }[type] || 'bg-cyan-950 border-cyan-700/50 text-cyan-300'
  }
  
  function typeIcon(type) {
    return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] || 'ℹ️'
  }
  
  function add(notif) {
    const id = Date.now()
    notifications.value.push({ id, ...notif })
    setTimeout(() => remove(id), notif.duration || 4000)
  }
  
  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  defineExpose({ add })
  </script>