<template>
    <div class="relative w-full rounded-2xl overflow-hidden" style="height: 300px; background: linear-gradient(180deg, #020c14 0%, #0d1f35 100%);">
  
      <!-- Stars -->
      <canvas ref="starsRef" class="absolute inset-0 w-full h-full opacity-60" />
  
      <!-- Graph line -->
      <canvas ref="graphRef" class="absolute inset-0 w-full h-full" />
  
      <!-- Plane -->
      <div v-if="isFlying"
           class="absolute transition-all duration-100"
           :style="planeStyle">
        <span class="text-3xl" style="animation: aviator-fly 1s ease-in-out infinite;">✈️</span>
      </div>
  
      <!-- Waiting overlay -->
      <Transition name="fade">
        <div v-if="isWaiting" class="absolute inset-0 flex flex-col items-center justify-center">
          <p class="text-5xl font-black font-mono text-yellow-400 mb-2">{{ countdown }}s</p>
          <p class="text-sm text-cyan-500 font-medium">Next round starting...</p>
          <div class="flex gap-1.5 mt-3">
            <span v-for="n in 5" :key="n"
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="n <= (5 - countdown) ? 'bg-yellow-400' : 'bg-cyan-800'" />
          </div>
        </div>
      </Transition>
  
      <!-- Flying multiplier -->
      <Transition name="fade">
        <div v-if="isFlying" class="absolute inset-0 flex items-center justify-center">
          <p class="text-6xl font-black font-mono transition-colors duration-100"
             :style="{ color: multiplierColor }">
            {{ multiplierFormatted }}x
          </p>
        </div>
      </Transition>
  
      <!-- Crashed overlay -->
      <Transition name="fade">
        <div v-if="isCrashed" class="absolute inset-0 flex flex-col items-center justify-center"
             style="background: rgba(255,23,68,0.06);">
          <p class="text-5xl font-black font-mono text-red-400 mb-1">{{ multiplierFormatted }}x</p>
          <p class="text-lg font-bold text-red-400">FLEW AWAY!</p>
          <p class="text-sm text-cyan-600 mt-2">Next round in {{ countdown }}s</p>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAviatorStore } from '../../stores/aviatorStore'
  
  const aviatorStore = useAviatorStore()
  const starsRef = ref(null)
  const graphRef = ref(null)
  
  const isWaiting  = computed(() => aviatorStore.isWaiting)
  const isFlying   = computed(() => aviatorStore.isFlying)
  const isCrashed  = computed(() => aviatorStore.isCrashed)
  const countdown  = computed(() => aviatorStore.countdown)
  const multiplierFormatted = computed(() => aviatorStore.multiplierFormatted)
  const multiplierColor     = computed(() => aviatorStore.multiplierColor)
  
  const planeStyle = computed(() => ({
    bottom: `${Math.min(30 + (aviatorStore.multiplier - 1) * 15, 75)}%`,
    left:   `${Math.min(20 + (aviatorStore.multiplier - 1) * 8, 70)}%`,
  }))
  
  function drawStars() {
    const c = starsRef.value
    if (!c) return
    c.width = c.offsetWidth; c.height = c.offsetHeight
    const ctx = c.getContext('2d')
    for (let i = 0; i < 80; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * c.width, Math.random() * c.height, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.1})`
      ctx.fill()
    }
  }
  
  onMounted(() => drawStars())
  onUnmounted(() => {})
  </script>