<template>
  <!-- Navbar Container -->
  <div class="fixed top-0 left-0 right-0 z-100 flex justify-center px-0 lg:px-24 xl:px-32 2xl:px-45">
    <nav class="w-full max-w-7xl bg-cyan-950 flex flex-col backdrop-blur-[14px] border-b border-[var(--border)]">

      <!-- ══ ROW 1 ══ -->
      <div class="flex items-center justify-between px-1 h-[var(--navbar-h)] gap-3">

        <!-- LEFT: Hamburger + Logo -->
        <div class="flex-shrink-0 flex items-center">
          <button class="lg:hidden  rounded-lg hover:bg-cyan-800/50 transition-colors mr-1"
                  @click="toggleSidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan-400">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <RouterLink to="/" class="flex items-center gap-0 text-decoration-none flex-shrink-0">
            <div class="lg:hidden    text-amber-400 font-display font-black text-base flex items-center justify-center">BM</div>
            <span class=" font-display text-[17px] font-bold tracking-[2px] bg-[var(--grad-gold)] bg-[length:200%_auto] text-amber-400 bg-clip-text animate-[shimmer_3s_linear_infinite] hidden sm:inline-block">BOOMBET</span>
          </RouterLink>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <template v-if="!isLoggedIn">
            <RouterLink to="/login" class="btn btn-ghost btn-sm">Login</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/deposite" class="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--gold)] text-decoration-none transition-colors hover:border-[var(--gold)] cursor-pointer">
              <span class="text-[10px] text-[var(--text-muted)] font-semibold">TZS</span>
              <span class="font-mono text-xs font-semibold text-[var(--gold)]">{{ formatBalance(balance) }}</span>
            </RouterLink>
            <RouterLink to="/profile" class="w-[34px] h-[34px] rounded-full flex items-center justify-center text-decoration-none cursor-pointer flex-shrink-0 bg-[var(--bg-card)] border border-[var(--gold)] text-[var(--text-muted)] transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </RouterLink>
          </template>
        </div>
      </div>

      <!-- ══ ROW 2 — Pills ══ -->
      <div class="border-t border-[var(--border)] px-4">
        <div class="flex items-center justify-start lg:justify-center gap-1 overflow-x-auto scrollbar-none py-1.5">
          <RouterLink
            v-for="link in navLinks" :key="link.name" :to="link.to"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-muted)] text-decoration-none whitespace-nowrap flex-shrink-0 transition-all border border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
            :class="{ 'text-[var(--red)] hover:bg-red-500/10': link.live }"
            active-class="text-[var(--gold)] !important bg-yellow-500/10 !important border-yellow-500/25 !important"
          >
            <span v-if="link.live" class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>{{ link.icon }}</span>
            <span>{{ link.name }}</span>
          </RouterLink>
        </div>
      </div>

    </nav>
  </div>

  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="sidebarOpen"
         class="fixed inset-0 z-[150] bg-black/60 lg:hidden"
         @click="closeSidebar" />
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
      :is-open="sidebarOpen"
      @close-sidebar="closeSidebar"
    />
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore'
import { useBetStore }  from '../../stores/bet/betStore'
import TheSidebar       from '../layout/MobileSidebar/MobileSidebar.vue'

// ============ DECLARE PROPS ============
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  },
  balance: {
    type: Number,
    default: 0
  }
})

// ============ DECLARE EMITS ============
const emit = defineEmits(['toggleSidebar', 'logout'])

const authStore = useAuthStore()
const betStore = useBetStore()
const sidebarOpen = ref(false)

function formatBalance(n) {
  return new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2 }).format(n || 0)
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  emit('toggleSidebar')
}

const closeSidebar = () => {
  sidebarOpen.value = false
  emit('toggleSidebar')
}

const handleLogout = () => {
  emit('logout')
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
/* Only keep essential styles that can't be done with Tailwind */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
</style>