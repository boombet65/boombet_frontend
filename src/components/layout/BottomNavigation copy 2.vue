<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-stretch h-16 bg-cyan-950 border-t border-cyan-800" style="backdrop-filter: blur(14px);">

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

    <RouterLink to="/bets" class="bottom-item" active-class="active">
      <span class="text-xl leading-none">🎟️</span>
      <span class="text-[10px] font-semibold">My Bets</span>
    </RouterLink>

    <RouterLink to="/profile" class="bottom-item" active-class="active">
      <span class="text-xl leading-none">👤</span>
      <span class="text-[10px] font-semibold">Account</span>
    </RouterLink>

  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBetStore } from '../../stores/betStore'

defineEmits(['open-slip'])
const betStore  = useBetStore()
const slipCount = computed(() => betStore.slipCount)
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