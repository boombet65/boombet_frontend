<template>
  <nav class="navbar bg-cyan-950">

    <!-- ══ ROW 1 ══ -->
    <div class="navbar__row1">

      <!-- LEFT: Hamburger + Logo -->
      <div class="navbar__left">
        <button class="lg:hidden p-1.5 rounded-lg hover:bg-cyan-800/50 transition-colors mr-2" @click="sidebarOpen = true">
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

      <!-- RIGHT: Actions — visible on ALL screens -->
      <div class="navbar__right">

        <!-- NOT logged in -->
        <template v-if="!isLoggedIn">
          <RouterLink to="/login"    class="btn btn-ghost btn-sm">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
        </template>

        <!-- Logged IN -->
        <template v-else>

          <!-- Balance -->
          <RouterLink to="/deposit" class="balance-chip">
            <span class="balance-chip__currency">KES</span>
            <span class="balance-chip__amount">{{ formatBalance(balance) }}</span>
          </RouterLink>

          <!-- Deposit -->
          <RouterLink to="/deposit" class="btn btn-primary btn-sm">
            + Deposit
          </RouterLink>

          <!-- Account — heroicons user icon -->
          <RouterLink to="/profile" class="navbar__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>

        </template>
      </div>
    </div>

    <!-- ══ ROW 2 — Pills centered ══ -->
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

  <!-- ══ Overlay ══ -->
  <Transition name="fade">
    <div v-if="sidebarOpen"
         class="fixed inset-0 z-[150] bg-black/60 lg:hidden"
         @click="sidebarOpen = false" />
  </Transition>

  <!-- ══ Mobile Drawer ══ -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-250 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div v-if="sidebarOpen" class="drawer lg:hidden">

      <div class="drawer__header">
        <RouterLink to="/" class="navbar__logo" @click="sidebarOpen = false">
          <div class="logo-icon">BM</div>
          <span class="logo-text">BOOMBET</span>
        </RouterLink>
        <button class="drawer__close" @click="sidebarOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div v-if="isLoggedIn" class="drawer__user">
        <RouterLink to="/profile" class="drawer__avatar" @click="sidebarOpen = false">
          {{ initials }}
        </RouterLink>
        <div class="drawer__user-info">
          <span class="drawer__user-phone">{{ authStore.user?.phone }}</span>
          <span class="drawer__user-balance">KES {{ formatBalance(balance) }}</span>
        </div>
        <RouterLink to="/deposit" class="btn btn-primary btn-sm" @click="sidebarOpen = false">
          + Deposit
        </RouterLink>
      </div>

      <div v-else class="drawer__auth">
        <RouterLink to="/login"    class="btn btn-ghost btn-sm flex-1" @click="sidebarOpen = false">Login</RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-sm flex-1" @click="sidebarOpen = false">Register</RouterLink>
      </div>

      <nav class="drawer__nav">
        <p class="drawer__section-label">Sports</p>
        <DrawerLink to="/sports"           icon="⚽" label="Football"     @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=basket"  icon="🏀" label="Basketball"   @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=tennis"  icon="🎾" label="Tennis"       @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=cricket" icon="🏏" label="Cricket"      @click="sidebarOpen = false" />
        <DrawerLink to="/sports/live"      icon="📡" label="Live Betting" :live="true" @click="sidebarOpen = false" />
        <div class="drawer__divider" />
        <p class="drawer__section-label">Casino</p>
        <DrawerLink to="/casino"            icon="🎲" label="All Games"  @click="sidebarOpen = false" />
        <DrawerLink to="/casino/aviator"    icon="✈️" label="Aviator"    :hot="true" @click="sidebarOpen = false" />
        <DrawerLink to="/casino?g=slots"    icon="🎰" label="Slots"      @click="sidebarOpen = false" />
        <DrawerLink to="/casino?g=roulette" icon="🎡" label="Roulette"   @click="sidebarOpen = false" />
        <div class="drawer__divider" />
        <p class="drawer__section-label">More</p>
        <DrawerLink to="/virtuals"   icon="🤖" label="Virtual Sports" @click="sidebarOpen = false" />
        <DrawerLink to="/jackpot"    icon="💰" label="Jackpot"        :hot="true" @click="sidebarOpen = false" />
        <DrawerLink to="/promotions" icon="🎁" label="Promotions"     @click="sidebarOpen = false" />
        <template v-if="isLoggedIn">
          <div class="drawer__divider" />
          <p class="drawer__section-label">My Account</p>
          <DrawerLink to="/profile"   icon="👤" label="Profile"   @click="sidebarOpen = false" />
          <DrawerLink to="/deposit"   icon="💳" label="Deposit"   @click="sidebarOpen = false" />
          <DrawerLink to="/dashboard" icon="📊" label="Dashboard" @click="sidebarOpen = false" />
          <DrawerLink to="/bets"      icon="📋" label="My Bets"   @click="sidebarOpen = false" />
        </template>
      </nav>

      <div class="drawer__footer">BoomBet v1.0 · 18+ Only · Play Responsibly</div>
    </div>
  </Transition>

</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBetStore }  from '../../stores/betStore'

const authStore   = useAuthStore()
const betStore    = useBetStore()
const sidebarOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const balance    = computed(() => authStore.user?.balance || 0)
const initials   = computed(() => (authStore.user?.phone || '').slice(-2))

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

<script>
import { RouterLink } from 'vue-router'
const DrawerLink = {
  components: { RouterLink },
  props: { to: String, icon: String, label: String, live: Boolean, hot: Boolean },
  emits: ['click'],
  template: `
    <RouterLink :to="to" class="drawer-link" active-class="drawer-link--active" @click="$emit('click')">
      <span class="drawer-link__icon">{{ icon }}</span>
      <span class="drawer-link__label">{{ label }}</span>
      <span v-if="live" class="drawer-link__live"></span>
      <span v-if="hot"  class="drawer-link__hot">HOT</span>
    </RouterLink>
  `
}
</script>

<style scoped>

/* ═══════════════════════════════
   NAVBAR — two rows
═══════════════════════════════ */
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

/* Row 1 */
.navbar__row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--navbar-h);
  gap: 12px;
}

/* Row 2 — pills */
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
.pill:hover {
  color: var(--text-primary);
  background: var(--border);
}
.pill--active {
  color: var(--gold) !important;
  background: rgba(255,193,7,0.1) !important;
  border-color: rgba(255,193,7,0.25) !important;
}
.pill--live { color: var(--red); }
.pill--live:hover { background: rgba(255,23,68,0.08); }

/* ═══ LEFT ═══ */
.navbar__left { flex-shrink: 0; display: flex; align-items: center; }

.navbar__logo {
  display: flex; align-items: center; gap: 8px;
  text-decoration: none; flex-shrink: 0;
}
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
  background-clip: text; animation: shimmer 3s linear infinite;
  display: none;
}

/* ═══ RIGHT — always visible ═══ */
.navbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.balance-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: border-color var(--transition);
  cursor: pointer;
}
.balance-chip:hover { border-color: var(--gold); }
.balance-chip__currency { font-size: 10px; color: var(--text-muted); font-weight: 600; }
.balance-chip__amount {
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 600; color: var(--gold);
}

/* Account avatar — icon only */
.navbar__avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; cursor: pointer; flex-shrink: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  transition: all var(--transition);
}
.navbar__avatar:hover {
  border-color: var(--gold);
  color: var(--gold);
}


/* ═══ RESPONSIVE ═══ */
@media (min-width: 640px) {
  .logo-text { display: block; }
}
@media (min-width: 1024px) {
  .navbar__row1 { padding: 0 20px; }
  .navbar__row2 { padding: 0 20px; }
  .pills-track {
    justify-content: center; /* desktop — center */
  }
}

/* ═══ DRAWER ═══ */
.drawer {
  position: fixed; top: 0; left: 0;
  width: 280px; height: 100%; z-index: 200;
  display: flex; flex-direction: column;
  background: #0a2535; border-right: 1px solid var(--border); overflow: hidden;
}
.drawer__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; height: var(--navbar-h);
  flex-shrink: 0; border-bottom: 1px solid var(--border);
}
.drawer__close {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border-radius: 8px; color: var(--text-muted);
  transition: background var(--transition), color var(--transition);
}
.drawer__close:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }

.drawer__user {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.drawer__avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--grad-gold); color: #080b12;
  font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; text-decoration: none; cursor: pointer;
  transition: box-shadow var(--transition);
}
.drawer__avatar:hover { box-shadow: 0 0 0 2px var(--gold); }
.drawer__user-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.drawer__user-phone {
  font-size: 13px; font-weight: 600; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.drawer__user-balance { font-size: 12px; color: var(--gold); font-family: var(--font-mono); }

.drawer__auth {
  display: flex; gap: 8px; padding: 12px 16px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
}

.drawer__nav { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: none; }
.drawer__nav::-webkit-scrollbar { display: none; }
.drawer__section-label {
  padding: 10px 10px 4px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin: 0;
}
.drawer__divider { height: 1px; margin: 6px 0; background: var(--border); }
.drawer__footer {
  padding: 12px 16px; font-size: 11px; text-align: center;
  color: var(--text-muted); border-top: 1px solid var(--border); flex-shrink: 0;
}

.drawer-link {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 10px; font-size: 14px; font-weight: 500;
  color: var(--text-muted); text-decoration: none;
  transition: background var(--transition), color var(--transition);
}
.drawer-link:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
.drawer-link--active { background: rgba(6,182,212,0.1); color: #67e8f9; }
.drawer-link__icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; line-height: 1; }
.drawer-link__label { flex: 1; }
.drawer-link__live {
  width: 8px; height: 8px; border-radius: 50%; background: var(--red);
  animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0;
}
.drawer-link__hot {
  font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 20px;
  background: rgba(255,109,0,0.15); color: #ff6d00;
  border: 1px solid rgba(255,109,0,0.3); flex-shrink: 0;
}

/* ═══ TRANSITIONS ═══ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>