// DefaultLayout.vue 
<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Loading State -->
    <DefaultLayoutSkeleton v-if="isLoading" />
    
    <!-- Actual Content -->
    <template v-else>
      <!-- Navbar Container - Centered with max-width -->
      <div class="fixed top-0 left-0 right-0 z-100 flex justify-center px-0 lg:px-24 xl:px-32 2xl:px-45">
        <div class="w-full max-w-7xl">
          <TheNavbar 
            :is-logged-in="isLoggedIn"
            :user="user"
            :balance="userBalance"
            @toggle-sidebar="toggleMobileSidebar"
            @logout="handleLogout"
          />
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="max-w-7xl mx-auto px-0 lg:px-0 pt-[calc(56px+52px)] lg:pt-[calc(56px+52px)]">
        <div class="flex flex-col lg:flex-row">
          <!-- Main Content - Left Side -->
          <div class="flex-1 min-w-0 bg-cyan-900/20 flex flex-col">
            <div class="flex-1">
              <slot name="main">
                <router-view></router-view>
              </slot>
            </div>
            
            <div class="lg:pb-0">
              <Footer />
            </div>
          </div>

          <!-- Right Sidebar - Desktop only (Fixed/Sticky) -->
          <div class="hidden lg:block flex-shrink-0 bg-gray-800/50 border-l border-gray-700/50 sticky top-[calc(56px+52px)] h-[calc(100vh-56px-52px)] overflow-y-auto backdrop-blur-sm"
               :class="sidebarWidthClass">
            <slot name="sidebar">
              <!-- Desktop Bet Slip -->
              <BetSlipSidebar />
            </slot>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation - Mobile only -->
      <BottomNavigation 
        :bet-slip-count="betSlipCount"
        :my-bets-count="myBetsCount"
        @open-slip="toggleBetSlip"
      />

    

      <!-- Bet Slip Sidebar - Mobile (inajifungua kutoka kulia) -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="isBetSlipOpen" class="fixed inset-0 z-[200] flex justify-end">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/60" @click="closeBetSlip"></div>
          
          <!-- Sidebar Content - full width on mobile -->
          <div class="relative w-full sm:w-[400px] md:w-[480px] h-full bg-[#0a1e2b] shadow-2xl overflow-hidden">
            <!-- Close button -->
            <button 
              @click="closeBetSlip"
              class="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- BetSlipSidebar content -->
            <BetSlipSidebar />
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'
import { RouterView } from 'vue-router'
import { useBetStore } from '../../stores/betStore'
import TheNavbar from '../../components/layout/TheNavbar.vue'
import BottomNavigation from '../../components/layout/BottomNavigation.vue'
import BetSlipSidebar from '../../components/betting/BetSlipSidebar.vue'
import Footer from './footer/Footer.vue'
import DefaultLayoutSkeleton from '../../components/skeletons/default/DefaultLayoutSkeleton.vue'

const authStore = useAuthStore()
const betStore = useBetStore()

// ---- Loading State ----
const isLoading = ref(true)

// ---- Auth state ----
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const userBalance = computed(() => {
  const balance = authStore.user?.balance
  if (typeof balance === 'string') {
    return parseFloat(balance) || 0
  }
  return balance || 0
})

// ---- Bet Slip state ----
const isBetSlipOpen = ref(false)
const isMobileSidebarOpen = ref(false)
const betSlipCount = computed(() => betStore.slipCount)

const myBetsCount = computed(() => {
  if (!betStore.userBets || betStore.userBets.length === 0) return 0
  
  return betStore.userBets.filter(b => {
    const status = (b.status || '').toUpperCase()
    return status === 'OPEN' || status === 'PENDING'
  }).length
})

// ---- Sidebar width ----
const sidebarWidthClass = computed(() => {
  return 'w-full lg:w-[300px] xl:w-[360px] 2xl:w-[420px]'
})

// ---- Methods ----
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const toggleBetSlip = () => {
  isBetSlipOpen.value = !isBetSlipOpen.value
}

const closeBetSlip = () => {
  isBetSlipOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeMobileSidebar()
}

// ---- Simulate loading ----
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<style scoped>
/* Hide scrollbar for all elements */
:global(*::-webkit-scrollbar) {
  width: 0px;
  height: 0px;
  background: transparent;
}

:global(*::-webkit-scrollbar-track) {
  background: transparent;
}

:global(*::-webkit-scrollbar-thumb) {
  background: transparent;
}

/* For Firefox */
:global(*) {
  scrollbar-width: none;
}

/* For IE and Edge */
:global(*) {
  -ms-overflow-style: none;
}
</style>