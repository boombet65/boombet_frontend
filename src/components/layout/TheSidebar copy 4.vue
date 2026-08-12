<template>
  <aside class="sidebar">
    <div class="sidebar__inner">

      <SidebarSection label="Sports">
        <SidebarLink to="/sports" icon="⚽" label="Football" />
        
        <SidebarLink to="/sports?s=basket"  icon="🏀" label="Basketball"   :disabled="true" @click="showToast" />
        <SidebarLink to="/sports?s=tennis"  icon="🎾" label="Tennis"       :disabled="true" @click="showToast" />
        <SidebarLink to="/sports?s=cricket" icon="🏏" label="Cricket"      :disabled="true" @click="showToast" />
        <SidebarLink to="/sports?s=rugby"   icon="🏉" label="Rugby"        :disabled="true" @click="showToast" />
        <SidebarLink to="/sports/live"      icon="🔴" label="Live Betting" :live="true" :disabled="true" @click="showToast" />
      </SidebarSection>

      <div class="sidebar__divider"></div>

      <SidebarSection label="Casino">
        <SidebarLink to="/casino"           icon="🎲" label="All Games" />
        <SidebarLink to="/casino/aviator"   icon="✈️" label="Aviator"   :hot="true" />
        
        <SidebarLink to="/casino?g=slots"    icon="🎰" label="Slots"     :disabled="true" @click="showToast" />
        <SidebarLink to="/casino?g=roulette" icon="🎡" label="Roulette"  :disabled="true" @click="showToast" />
        <SidebarLink to="/casino?g=blackjack"icon="🃏" label="Blackjack" :disabled="true" @click="showToast" />
      </SidebarSection>

      <div class="sidebar__divider"></div>

      <SidebarSection label="More">
        <SidebarLink to="/virtuals"   icon="🤖" label="Virtual Sports" :disabled="true" @click="showToast" />
        <SidebarLink to="/jackpot"    icon="💰" label="Jackpot" :hot="true" :disabled="true" @click="showToast" />
        <SidebarLink to="/promotions" icon="🎁" label="Promotions" :disabled="true" @click="showToast" />
      </SidebarSection>

      <template v-if="isLoggedIn">
        <div class="sidebar__divider"></div>
        <SidebarSection label="My Account">
          <SidebarLink to="/dashboard" icon="📊" label="Dashboard" />
          <SidebarLink to="/bets"      icon="📋" label="My Bets" />
        </SidebarSection>
      </template>

    </div>

    <div class="sidebar__footer">
      <p>BoomBet v1.0 · 18+ Only</p>
    </div>
  </aside>

  <Transition name="toast-fade">
    <div v-if="isToastVisible" class="custom-toast">
      <span class="toast-icon">⚠️</span>
      <span class="toast-message">Not active now</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import SidebarSection from './SidebarSection.vue'
import SidebarLink    from './SidebarLink.vue'

const authStore  = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Kudhibiti custom toast
const isToastVisible = ref(false)
let toastTimeout = null

const showToast = () => {
  if (toastTimeout) clearTimeout(toastTimeout)
  isToastVisible.value = true
  toastTimeout = setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--navbar-h);
  left: 0;
  bottom: 0;
  width: var(--sidebar-w);
  background: rgba(6, 8, 16, 0.98);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow: hidden;
}

.sidebar__inner {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px;
  scrollbar-width: none;
}
.sidebar__inner::-webkit-scrollbar { display: none; }

.sidebar__divider {
  height: 1px;
  background: var(--border);
  margin: 8px 4px;
}

.sidebar__footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
}

/* Custom Toast Styles */
.custom-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffc107;
  color: #060810;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.toast-icon { font-size: 16px; }

/* Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>