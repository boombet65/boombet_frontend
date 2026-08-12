<!-- aviator.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-sans">
    <!-- Main Game Card -->
    <div class="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
      
      <!-- Game Header / Stats Bar -->
      <div class="grid grid-cols-3 gap-4 p-4 bg-slate-900/80 border-b border-slate-700">
        <div class="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-2">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-slate-400 text-sm font-medium">FLIGHT STATUS</span>
          <span class="text-emerald-400 font-mono font-bold text-sm">CRUISING</span>
        </div>
        <div class="flex items-center justify-center gap-2 bg-slate-800/50 rounded-xl px-4 py-2">
          <span class="text-slate-400 text-sm font-medium">ROUND</span>
          <span class="text-white font-mono font-bold text-lg">#{{ roundId }}</span>
        </div>
        <div class="flex items-center justify-end gap-3 bg-slate-800/50 rounded-xl px-4 py-2">
          <span class="text-slate-400 text-sm font-medium">PLAYERS</span>
          <span class="text-white font-mono font-bold">{{ activePlayers }}</span>
          <div class="flex -space-x-2">
            <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-slate-800"></div>
          </div>
        </div>
      </div>

      <!-- Main Game Area -->
      <div class="relative p-6">
        <!-- Canvas / Flight Path Visualization -->
        <div class="relative bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner">
          <!-- Grid Background -->
          <div class="absolute inset-0 opacity-20">
            <div class="absolute inset-0 bg-[linear-gradient(90deg,#475569_1px,transparent_1px),linear-gradient(0deg,#475569_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          
          <!-- Altitude / Multiplier Scale -->
          <div class="absolute left-4 top-4 bottom-4 w-12 flex flex-col justify-between text-xs text-slate-500 font-mono">
            <span>10x</span>
            <span>8x</span>
            <span>6x</span>
            <span>4x</span>
            <span>2x</span>
            <span>1x</span>
          </div>

          <!-- Flight Path Line (Static design) -->
          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M0,300 Q150,300 200,200 T400,100 T700,50" stroke="#ec4899" stroke-width="3" fill="none" class="opacity-70" stroke-dasharray="8 4" />
            <path d="M0,300 Q150,300 200,200 T400,100 T700,50" stroke="#06b6d4" stroke-width="2" fill="none" />
          </svg>

          <!-- The Airplane (Animated) -->
          <div class="absolute transition-all duration-300 ease-out" 
               :style="{ left: `${planeX}%`, bottom: `${planeY}%` }">
            <div class="relative">
              <div class="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span class="text-2xl">✈️</span>
              </div>
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-amber-400 font-mono font-bold text-sm whitespace-nowrap">
                {{ currentMultiplier }}x
              </div>
            </div>
          </div>

          <!-- Crash Point Indicator -->
          <div v-if="crashed" class="absolute right-8 top-8 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-white animate-bounce">
            💥 CRASHED @ {{ crashMultiplier }}x
          </div>

          <!-- In-Flight Message -->
          <div v-if="!crashed && !isFlying" class="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div class="text-center">
              <div class="text-5xl mb-3">🛫</div>
              <div class="text-slate-300 font-medium">Waiting for next round...</div>
              <div class="text-slate-500 text-sm">Place your bets before takeoff</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Betting & Controls Section -->
      <div class="p-6 pt-0 space-y-6">
        <!-- Live Multiplier Display -->
        <div class="flex justify-center items-center gap-6">
          <div class="text-center">
            <div class="text-slate-400 text-xs uppercase tracking-wider">Current Multiplier</div>
            <div :class="['text-5xl font-black font-mono transition-all', crashed ? 'text-red-500' : 'text-cyan-400']">
              {{ currentMultiplier.toFixed(2) }}x
            </div>
          </div>
        </div>

        <!-- User Bet Slip -->
        <div class="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
          <div class="flex flex-wrap gap-6 items-end justify-between">
            <!-- Bet Amount Input -->
            <div class="flex-1 min-w-[140px]">
              <label class="block text-slate-400 text-xs font-medium mb-1">BET AMOUNT</label>
              <div class="flex items-center bg-slate-900 rounded-xl border border-slate-700 focus-within:border-cyan-500 transition-colors">
                <span class="pl-3 text-slate-500">$</span>
                <input type="number" v-model="betAmount" :disabled="isFlying || crashed" 
                       class="w-full bg-transparent px-3 py-2 text-white font-mono focus:outline-none" 
                       placeholder="10.00" step="1" min="1">
              </div>
            </div>
            
            <!-- Auto Cash Out Input -->
            <div class="flex-1 min-w-[140px]">
              <label class="block text-slate-400 text-xs font-medium mb-1">AUTO CASH OUT @</label>
              <div class="flex items-center bg-slate-900 rounded-xl border border-slate-700 focus-within:border-cyan-500">
                <input type="number" v-model="autoCashout" :disabled="isFlying || crashed" 
                       class="w-full bg-transparent px-3 py-2 text-white font-mono focus:outline-none" 
                       placeholder="2.00" step="0.5" min="1.01">
                <span class="pr-3 text-slate-500">x</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button @click="placeBet" :disabled="betPlaced || !betAmount || betAmount <= 0 || isFlying"
                      class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105">
                PLACE BET
              </button>
              <button @click="cashOut" :disabled="!betPlaced || crashed || !isFlying"
                      class="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105">
                CASH OUT
              </button>
            </div>
          </div>

          <!-- Bet Status -->
          <div v-if="betPlaced" class="mt-3 text-sm">
            <span class="text-slate-400">Your active bet: </span>
            <span class="text-emerald-400 font-mono font-bold">${{ betAmount }}</span>
            <span class="text-slate-400"> at </span>
            <span class="text-cyan-400 font-mono font-bold">{{ currentMultiplier.toFixed(2) }}x</span>
            <span v-if="autoCashout" class="text-slate-400 ml-2">(Auto cashout @ {{ autoCashout }}x)</span>
          </div>
        </div>

        <!-- Recent Results / History -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">Recent Crashes</span>
            <div class="h-px flex-1 bg-slate-700/50"></div>
          </div>
          <div class="flex gap-2 flex-wrap">
            <div v-for="(result, idx) in recentResults" :key="idx" 
                 class="px-3 py-1 bg-slate-800 rounded-full text-sm font-mono"
                 :class="result > 3 ? 'text-emerald-400' : 'text-red-400'">
              {{ result.toFixed(2) }}x
            </div>
          </div>
        </div>

        <!-- Simulation Controls (Debug) -->
        <div class="flex gap-2 pt-2 border-t border-slate-700/50">
          <button @click="startRound" :disabled="isFlying" class="text-xs px-3 py-1 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600">▶ Start Round</button>
          <button @click="forceCrash" :disabled="!isFlying" class="text-xs px-3 py-1 bg-red-900/50 rounded-lg text-red-300 hover:bg-red-800/50">💥 Force Crash</button>
          <button @click="resetGame" class="text-xs px-3 py-1 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600">🔄 Reset</button>
        </div>
        <div class="text-center text-xs text-slate-500 mt-2">
          * Simulation mode — Multiplier increases randomly until crash
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'

// Reactive state
const roundId = ref(1247)
const activePlayers = ref(342)
const currentMultiplier = ref(1.00)
const crashed = ref(false)
const isFlying = ref(false)
const betPlaced = ref(false)
const betAmount = ref(10)
const autoCashout = ref(2.0)
const crashMultiplier = ref(0)
const recentResults = ref([1.23, 5.67, 2.34, 8.91, 1.05])

// Flight simulation
let animationInterval = null
let crashPoint = 0

const generateCrashPoint = () => {
  // Random crash point between 1.01 and 10.0, with higher chance of early crash
  const r = Math.random()
  if (r < 0.4) return 1.5 + Math.random() * 1.5  // 40% chance: 1.5x - 3.0x
  if (r < 0.7) return 3.0 + Math.random() * 3    // 30% chance: 3.0x - 6.0x
  return 6.0 + Math.random() * 5                 // 30% chance: 6.0x - 11.0x
}

const startFlight = () => {
  if (animationInterval) clearInterval(animationInterval)
  
  crashed.value = false
  currentMultiplier.value = 1.00
  crashPoint = generateCrashPoint()
  isFlying.value = true
  
  console.log(`Round started. Crash point: ${crashPoint.toFixed(2)}x`)
  
  animationInterval = setInterval(() => {
    if (!isFlying.value) return
    
    // Increase multiplier exponentially
    let increment = currentMultiplier.value * 0.03
    currentMultiplier.value += increment
    
    // Check crash condition
    if (currentMultiplier.value >= crashPoint) {
      endRound(true)
    }
    
    // Auto cashout check
    if (betPlaced.value && autoCashout.value > 0 && currentMultiplier.value >= autoCashout.value) {
      cashOut()
    }
  }, 100)
}

const endRound = (didCrash) => {
  if (!isFlying.value) return
  if (animationInterval) clearInterval(animationInterval)
  
  isFlying.value = false
  
  if (didCrash) {
    crashed.value = true
    crashMultiplier.value = currentMultiplier.value
    recentResults.value = [crashMultiplier.value, ...recentResults.value.slice(0, 4)]
    
    // User loses bet if still active
    if (betPlaced.value) {
      betPlaced.value = false
      // loss logic
    }
  }
  
  // Auto reset after 3 seconds
  setTimeout(() => {
    if (!isFlying.value) {
      resetRoundState()
    }
  }, 3000)
}

const resetRoundState = () => {
  crashed.value = false
  currentMultiplier.value = 1.00
  betPlaced.value = false
  // Optionally start a new round automatically
  // startRound()
}

const placeBet = () => {
  if (betAmount.value > 0 && !isFlying.value && !betPlaced.value) {
    betPlaced.value = true
    // In real game, would deduct balance
  }
}

const cashOut = () => {
  if (betPlaced.value && isFlying.value && !crashed.value) {
    const winAmount = betAmount.value * currentMultiplier.value
    betPlaced.value = false
    // In real game, would add winAmount to balance
    console.log(`Cashed out at ${currentMultiplier.value.toFixed(2)}x for $${winAmount.toFixed(2)}`)
  }
}

const startRound = () => {
  if (!isFlying.value) {
    roundId.value++
    startFlight()
  }
}

const forceCrash = () => {
  if (isFlying.value) {
    endRound(true)
  }
}

const resetGame = () => {
  if (animationInterval) clearInterval(animationInterval)
  isFlying.value = false
  crashed.value = false
  betPlaced.value = false
  currentMultiplier.value = 1.00
}

// Reactive mapping to plane position (simple curve)
const planeX = ref(0)
const planeY = ref(0)

watch(currentMultiplier, (newVal) => {
  // Map multiplier 1-10 to x% 0-85%, y% 0-80% with easing
  let t = Math.min((newVal - 1) / 10, 0.95)
  planeX.value = t * 85
  planeY.value = Math.pow(t, 1.5) * 75
})

// Cleanup on unmount
onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})
</script>