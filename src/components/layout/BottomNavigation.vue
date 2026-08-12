<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-16 bg-cyan-950 border-t border-cyan-800" style="backdrop-filter: blur(14px); ">

    <RouterLink to="/" class="bottom-item" exact-active-class="active">
      <span class="text-xl leading-none">🏠</span>
      <span class="text-[10px] font-semibold">Home</span>
    </RouterLink>

    <RouterLink to="/sports" class="bottom-item" active-class="active">
      <span class="text-xl leading-none">⚽</span>
      <span class="text-[10px] font-semibold">Sports</span>
    </RouterLink>

    <!-- Slip — center, triggers emit -->
    <button class="bottom-item relative" @click="$emit('open-slip')">
      <span class="text-xl leading-none">📋</span>
      <span class="text-[10px] font-semibold">Slip</span>
      <span v-if="slipCount > 0"
            class="absolute top-1.5 right-[calc(50%-18px)] min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full text-[9px] font-black bg-yellow-400 text-cyan-950">
        {{ slipCount }}
      </span>
    </button>

    <!-- My Bets with Badge -->
    <RouterLink to="/bets" class="bottom-item relative" active-class="active">
      <span class="text-xl leading-none">🎟️</span>
      <span class="text-[10px] font-semibold">My Bets</span>
      <!-- Badge for open bets count -->
      <span v-if="openBetsCount > 0"
            class="absolute top-1.5 right-[calc(50%-18px)] min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full text-[9px] font-black bg-emerald-400 text-cyan-950">
        {{ openBetsCount }}
      </span>
    </RouterLink>

    <RouterLink to="/profile" class="bottom-item" active-class="active">
      <span class="text-xl leading-none">👤</span>
      <span class="text-[10px] font-semibold">Account</span>
    </RouterLink>

  </nav>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useBetStore } from '../../stores/bet/betStore'
import { useAuthStore } from '../../stores/auth/authStore'

defineEmits(['open-slip'])

const betStore = useBetStore()
const authStore = useAuthStore()

const slipCount = computed(() => betStore.slipCount)

// Get open bets count from store
const openBetsCount = computed(() => {
  // If not logged in, return 0
  if (!authStore.isLoggedIn) return 0
  
  // If userBets is not loaded yet or undefined, return 0
  if (!betStore.userBets || !Array.isArray(betStore.userBets) || betStore.userBets.length === 0) return 0
  
  // Count bets that are OPEN and PENDING
  return betStore.userBets.filter(bet => 
    bet.status === 'OPEN' && bet.result === 'PENDING'
  ).length
})

// Refresh bets when user logs in or navigates
onMounted(() => {
  if (authStore.isLoggedIn && betStore.userBets && betStore.userBets.length === 0) {
    betStore.loadUserBets({ limit: 100 })
  }
})

// Watch for changes in userBets
watch(() => betStore.userBets, () => {
  // Just trigger reactivity
}, { deep: true, immediate: true })
</script>

<style scoped>
.bottom-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding-bottom: 4px;
  text-decoration: none;
  color: var(--text-muted, #4a7a8f);
  font-size: 11px;
  font-weight: 600;
  position: relative;
  transition: color 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body, 'Rajdhani', sans-serif);
}
.bottom-item:hover { color: #7dd3fc; }
.bottom-item.active { color: #facc15; }
</style>