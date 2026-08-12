<template>
  <nav class="navbar bg-cyan-950">

    <!-- ══ ROW 1 ══ -->
    <div class="navbar__row1">

      <!-- LEFT: Hamburger + Logo -->
      <div class="navbar__left">
        <button class="lg:hidden p-1.5 rounded-lg hover:bg-cyan-800/50 transition-colors mr-2"
                @click="sidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan-400">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <RouterLink to="/" class="navbar__logo">
          <div class="logo-icon">BM</div>
          <span class="logo-text">BOOMBET</span>
        </RouterLink>
      </div>

      <!-- RIGHT -->
      <div class="navbar__right">
        <template v-if="!isLoggedIn">
          <RouterLink to="/login"    class="btn btn-ghost btn-sm">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/deposite" class="balance-chip">
            <span class="balance-chip__currency">TZS</span>
            <span class="balance-chip__amount">{{ formatBalance(balance) }}</span>
          </RouterLink>
          <!-- <RouterLink to="/deposit" class="btn btn-primary btn-sm">+ Deposit</RouterLink> -->
          <RouterLink to="/profile" class="navbar__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- ══ ROW 2 — Pills ══ -->
    <div class="navbar__row2">
      <div class="pills-track">
        <RouterLink
          v-for="link in navLinks" :key="link.name" :to="link.to"
          class="pill"
          :class="{ 'pill--live': link.live }"
          active-class="pill--active"
        >
          <span v-if="link.live" class="live-dot" style="width:6px;height:6px;"></span>
          <span>{{ link.icon }}</span>
          <span>{{ link.name }}</span>
        </RouterLink>
      </div>
    </div>

  </nav>

  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="sidebarOpen"
         class="fixed inset-0 z-[150] bg-black/60 lg:hidden"
         @click="sidebarOpen = false" />
  </Transition>

  <!-- TheSidebar — mobile only, slides from left -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <TheSidebar
      v-if="sidebarOpen"
      class="lg:hidden"
      :mobile="true"
      @close="sidebarOpen = false"
    />
  </Transition>

</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBetStore }  from '../../stores/betStore'
import TheSidebar       from './TheSidebar.vue'

const authStore   = useAuthStore()
const betStore    = useBetStore()
const sidebarOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const balance    = computed(() => authStore.user?.balance || 0)

function formatBalance(n) {
  return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n)
}

const navLinks = [
  { name: 'Sports',     to: '/sports',         icon: '⚽' },
  { name: 'Live',       to: '/sports/live',    icon: '📡', live: true },
  { name: 'Casino',     to: '/casino',         icon: '🎲' },
  { name: 'Aviator',    to: '/casino/aviator', icon: '✈️' },
  { name: 'Virtuals',   to: '/virtuals',       icon: '🤖' },
  { name: 'Jackpot',    to: '/jackpot',        icon: '💰' },
  { name: 'Promotions', to: '/promotions',     icon: '🎁' },
]
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.navbar__row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--navbar-h);
  gap: 12px;
}

.navbar__row2 {
  border-top: 1px solid var(--border);
  padding: 0 16px;
}
.pills-track {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 6px 0;
}
.pills-track::-webkit-scrollbar { display: none; }

@media (min-width: 1024px) {
  .pills-track { justify-content: center; }
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--transition);
  border: 1px solid transparent;
}
.pill:hover { color: var(--text-primary); background: var(--border); }
.pill--active {
  color: var(--gold) !important;
  background: rgba(255,193,7,0.1) !important;
  border-color: rgba(255,193,7,0.25) !important;
}
.pill--live { color: var(--red); }
.pill--live:hover { background: rgba(255,23,68,0.08); }

.navbar__left  { flex-shrink: 0; display: flex; align-items: center; }
.navbar__right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.navbar__logo  { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.logo-icon {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--grad-gold); color: #080b12;
  font-family: var(--font-display); font-weight: 900; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
}
.logo-text {
  font-family: var(--font-display); font-size: 17px; font-weight: 700;
  letter-spacing: 2px; background: var(--grad-gold); background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: shimmer 3s linear infinite; display: none;
}

.balance-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--gold);
  /* border-color: var(--gold);  */
  text-decoration: none;
  transition: border-color var(--transition);
  cursor: pointer;
}
.balance-chip:hover { border-color: var(--gold); }
.balance-chip__currency { font-size: 10px; color: var(--text-muted); font-weight: 600; }
.balance-chip__amount   { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--gold); }

.navbar__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--gold);
  color: var(--text-muted);
  transition: all var(--transition);
}
.navbar__avatar:hover { border-color: var(--gold); color: var(--gold); }

@media (min-width: 640px)  { .logo-text { display: block; } }
@media (min-width: 1024px) { .navbar__row1 { padding: 0 20px; } .navbar__row2 { padding: 0 20px; } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
</style>