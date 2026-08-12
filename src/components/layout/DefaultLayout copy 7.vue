<template>
  <div class="min-h-screen bg-[#212223]">
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
      <div class="max-w-7xl mx-auto px-0 lg:px-0 pt-[calc(56px+52px+16px)] lg:pt-[calc(56px+52px)]">
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
        @toggle-betslip="toggleBetSlip"
      />

      <!-- Mobile Sidebar -->
      <BetSlipSidebar
        :open="isMobileSidebarOpen"
        :is-logged-in="isLoggedIn"
        :user="user"
        :balance="userBalance"
        @close="closeMobileSidebar"
        @logout="handleLogout"
      />

      <!-- Bet Slip Drawer - Mobile only -->
      <BetSlipContent 
        mode="drawer"
        :open="isBetSlipOpen"
        @close="closeBetSlip"
        @place-bet="handlePlaceBet"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth/authStore.js'
import { RouterView } from 'vue-router'
import { useBetStore } from '../../stores/betStore'
import TheNavbar from '../../components/layout/TheNavbar.vue'
import TheSidebar from '../../components/layout/TheSidebar.vue'
import BottomNavigation from '../../components/layout/BottomNavigation.vue'
import BetSlipSidebar from '../../components/betting/BetSlipSidebar.vue'
import BetSlipContent from '../../components/betting/BetSlipContent.vue'
import Footer from './footer/Footer.vue'

import MobileSidebar from '../../components/layout/MobileSidebar/MobileSidebar.vue'
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

const handlePlaceBet = (data) => {
  console.log('Bet placed:', data)
  // Handle bet placement result
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