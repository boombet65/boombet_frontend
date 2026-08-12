<template>
  <nav class="navbar bg-cyan-950 z-60">

    <!-- LEFT: Logo -->
    <div class="navbar__left">

      <!-- Hamburger — mobile only -->
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

    <!-- CENTER: Nav links (desktop only) -->
    <div class="navbar__center">
      <RouterLink
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        class="navbar__link"
        :class="{ 'navbar__link--live': link.live }"
      >
        <span v-if="link.live" class="live-dot"></span>
        {{ link.name }}
      </RouterLink>
    </div>

    <!-- RIGHT: Actions -->
    <div class="navbar__right">

      <!-- LIVE pill -->
      <div class="live-pill">
        <span class="live-dot"></span>
        <span>LIVE</span>
      </div>

      <!-- Logged IN state -->
      <template v-if="isLoggedIn">

        <!-- Balance -->
        <RouterLink to="/dashboard" class="balance-chip">
          <span class="balance-chip__currency">KES</span>
          <span class="balance-chip__amount">{{ formatBalance(balance) }}</span>
        </RouterLink>

        <!-- Deposit button -->
        <RouterLink to="/dashboard" class="btn btn-primary btn-sm navbar__deposit">
          + Deposit
        </RouterLink>

        <!-- Bet slip toggle -->
        <button class="betslip-btn" @click="openBetSlip">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
          </svg>
          <span v-if="slipCount > 0" class="betslip-btn__count">{{ slipCount }}</span>
        </button>

        <!-- Avatar -->
        <div class="navbar__avatar" @click="profileOpen = !profileOpen" ref="avatarRef">
          <span class="avatar-initials">{{ initials }}</span>
          <Transition name="fade">
            <ProfileDropdown v-if="profileOpen" @close="profileOpen = false" />
          </Transition>
        </div>
      </template>

      <!-- Logged OUT state -->
      <template v-else>
        <RouterLink to="/login"    class="btn btn-ghost btn-sm">Login</RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
      </template>

    </div>
  </nav>

  <!-- ══ Overlay ══ -->
  <Transition name="fade">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-150 bg-black/70 lg:hidden"
      @click="sidebarOpen = false"
    />
  </Transition>

  <!-- ══ Mobile Drawer — full height from top ══ -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div v-if="sidebarOpen"
         class="fixed top-0 left-0 h-full w-72 z-[200] flex flex-col lg:hidden"
         style="background: var(--bg-sidebar, #0a2535); border-right: 1px solid var(--border);">

      <!-- Drawer header -->
      <div class="flex items-center justify-between px-4 flex-shrink-0"
           style="height: var(--navbar-h); border-bottom: 1px solid var(--border);">
        <RouterLink to="/" class="navbar__logo" @click="sidebarOpen = false">
          <div class="logo-icon">BM</div>
          <span class="logo-text" style="display: block;">BOOMBET</span>
        </RouterLink>
        <button class="p-2 rounded-lg transition-colors"
                style="color: var(--text-muted);"
                @click="sidebarOpen = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6"  y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Drawer nav links -->
      <div class="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" style="scrollbar-width: none;">

        <p class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Sports</p>
        <DrawerLink to="/sports"           icon="⚽" label="Football"     @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=basket"  icon="🏀" label="Basketball"   @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=tennis"  icon="🎾" label="Tennis"       @click="sidebarOpen = false" />
        <DrawerLink to="/sports?s=cricket" icon="🏏" label="Cricket"      @click="sidebarOpen = false" />
        <DrawerLink to="/sports/live"      icon="📡" label="Live Betting" :live="true" @click="sidebarOpen = false" />

        <div class="h-px my-2" style="background: var(--border);" />

        <p class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Casino</p>
        <DrawerLink to="/casino"            icon="🎲" label="All Games"  @click="sidebarOpen = false" />
        <DrawerLink to="/casino/aviator"    icon="✈️" label="Aviator"    :hot="true" @click="sidebarOpen = false" />
        <DrawerLink to="/casino?g=slots"    icon="🎰" label="Slots"      @click="sidebarOpen = false" />
        <DrawerLink to="/casino?g=roulette" icon="🎡" label="Roulette"   @click="sidebarOpen = false" />

        <div class="h-px my-2" style="background: var(--border);" />

        <p class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">More</p>
        <DrawerLink to="/virtuals"   icon="🤖" label="Virtual Sports" @click="sidebarOpen = false" />
        <DrawerLink to="/jackpot"    icon="💰" label="Jackpot"        :hot="true" @click="sidebarOpen = false" />
        <DrawerLink to="/promotions" icon="🎁" label="Promotions"     @click="sidebarOpen = false" />

        <template v-if="isLoggedIn">
          <div class="h-px my-2" style="background: var(--border);" />
          <p class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">My Account</p>
          <DrawerLink to="/dashboard" icon="📊" label="Dashboard" @click="sidebarOpen = false" />
          <DrawerLink to="/bets"      icon="📋" label="My Bets"   @click="sidebarOpen = false" />
        </template>
      </div>

      <!-- Drawer footer -->
      <div class="px-4 py-3 text-center text-[11px]"
           style="border-top: 1px solid var(--border); color: var(--text-muted);">
        BoomBet v1.0 · 18+ Only
      </div>
    </div>
  </Transition>

</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useBetStore }  from '../../stores/betStore'
import ProfileDropdown  from '../../components/layout/ProfileDropdown.vue'

const authStore   = useAuthStore()
const betStore    = useBetStore()
const profileOpen = ref(false)
const sidebarOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const balance    = computed(() => authStore.user?.balance || 0)
const slipCount  = computed(() => betStore.slipCount)
const initials   = computed(() => {
  const u = authStore.user
  if (!u) return '?'
  return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase()
})

function formatBalance(n) {
  return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function openBetSlip() {
  betStore.isOpen = true
}

const navLinks = [
  { name: 'Sports',     to: '/sports' },
  { name: 'Live',       to: '/sports/live', live: true },
  { name: 'Casino',     to: '/casino' },
  { name: 'Aviator',    to: '/casino/aviator' },
  { name: 'Virtuals',   to: '/virtuals' },
  { name: 'Jackpot',    to: '/jackpot' },
  { name: 'Promotions', to: '/promotions' },
]
</script>

<script>
import { RouterLink } from 'vue-router'
const DrawerLink = {
  components: { RouterLink },
  props: { to: String, icon: String, label: String, live: Boolean, hot: Boolean },
  emits: ['click'],
  template: `
    <RouterLink :to="to"
      class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm  font-medium transition-all no-underline"
      style="color: var(--text-muted);"
      active-class="bg-cyan-800/50 !text-cyan-200"
      @click="$emit('click')">
      <span class="text-base w-5 text-center leading-none flex-shrink-0">{{ icon }}</span>
      <span class="flex-1">{{ label }}</span>
      <span v-if="live" class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      <span v-if="hot" class="text-[9px] font-black px-1.5 py-0.5 rounded-full"
            style="background: rgba(255,109,0,0.15); color: #ff6d00; border: 1px solid rgba(255,109,0,0.3);">HOT</span>
    </RouterLink>
  `
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--navbar-h);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: var(--grad-gold);
  color: #080b12;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  background: var(--grad-gold);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
  display: none;
}

.navbar__left  { flex-shrink: 0; display: flex; align-items: center; }
.navbar__center {
  display: none;
  flex: 1;
  align-items: center;
  gap: 2px;
  margin: 0 12px;
}
.navbar__link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: all var(--transition);
  white-space: nowrap;
}
.navbar__link:hover,
.navbar__link.router-link-active { color: var(--text-primary); background: var(--border); }
.navbar__link--live { color: var(--red); }
.navbar__link--live:hover { background: rgba(255,23,68,0.08); }

.navbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.live-pill {
  display: none;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(255,23,68,0.1);
  border: 1px solid rgba(255,23,68,0.2);
  font-size: 11px;
  font-weight: 700;
  color: var(--red);
  letter-spacing: 0.5px;
}
.balance-chip {
  display: none;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: border-color var(--transition);
}
.balance-chip:hover { border-color: var(--border-light); }
.balance-chip__currency { font-size: 11px; color: var(--text-muted); font-weight: 600; }
.balance-chip__amount   { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--gold); }

.navbar__deposit { display: none; }

.betslip-btn {
  position: relative;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: all var(--transition);
}
.betslip-btn:hover { border-color: var(--gold); color: var(--gold); }
.betslip-btn__count {
  position: absolute;
  top: -5px; right: -5px;
  width: 17px; height: 17px;
  background: var(--gold);
  color: #080b12;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.navbar__avatar {
  position: relative;
  width: 34px; height: 34px;
  cursor: pointer;
}
.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--grad-gold);
  color: #080b12;
  font-size: 12px;
  font-weight: 800;
}

@media (min-width: 640px) {
  .live-pill    { display: flex; }
  .logo-text    { display: block; }
  .balance-chip { display: flex; }
  .navbar__deposit { display: inline-flex; }
}
@media (min-width: 1024px) {
  .navbar { padding: 0 20px; }
  .navbar__center { display: flex; }
}
</style>