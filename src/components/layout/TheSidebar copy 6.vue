<template>
  <aside 
    class="sidebar" 
    :class="{ 
      'sidebar--mobile': isMobile,
      'sidebar--open': isOpen && isMobile
    }"
  >
    <div class="sidebar__inner">

   <div class="flex flex-col" v-if="isMobile">

    <div class="flex-shrink-0 flex items-center">
   

        <RouterLink to="/" class="flex items-center justify-between gap-2 no-underline shrink-0">
          
          <div  class="flex items-center justify-center w-[34px] h-[34px] rounded-md bg-[linear-gradient(135deg,#ffa000,#ffd54f)] text-[#080b12]" >
          <span class="text-lg font-bold text-[#080b12]">BM</span>
          </div>
          <span class="text-lg font-bold text-cyan-100">BoomBet</span>
        </RouterLink>
      </div>
      <!-- Close button kwa mobile -->
      <button 
        v-if="isMobile"
        class="sidebar__close lg:hidden"
        @click="$emit('close-sidebar')"
      >
        ✕
      </button>
   
   </div>

      <SidebarSection label="Sports">
        <SidebarLink 
          to="/sports" 
          icon="⚽" 
          label="Football" 
          @click="handleLinkClick"
        />
        
        <SidebarLink 
          to="/sports?s=basket"  
          icon="🏀" 
          label="Basketball"   
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/sports?s=tennis"  
          icon="🎾" 
          label="Tennis"       
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/sports?s=cricket" 
          icon="🏏" 
          label="Cricket"      
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/sports?s=rugby"   
          icon="🏉" 
          label="Rugby"        
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/sports/live"      
          icon="🔴" 
          label="Live Betting" 
          :live="true" 
          :disabled="true" 
          @click="handleDisabledClick"
        />
      </SidebarSection>

      <div class="sidebar__divider"></div>

      <SidebarSection label="Casino">
        <SidebarLink 
          to="/casino"           
          icon="🎲" 
          label="All Games" 
          @click="handleLinkClick"
        />
        <SidebarLink 
          to="/casino/aviator"   
          icon="✈️" 
          label="Aviator"   
          :hot="true" 
          @click="handleLinkClick"
        />
        
        <SidebarLink 
          to="/casino?g=slots"    
          icon="🎰" 
          label="Slots"     
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/casino?g=roulette" 
          icon="🎡" 
          label="Roulette"  
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/casino?g=blackjack"
          icon="🃏" 
          label="Blackjack" 
          :disabled="true" 
          @click="handleDisabledClick"
        />
      </SidebarSection>

      <div class="sidebar__divider"></div>

      <SidebarSection label="More">
        <SidebarLink 
          to="/virtuals"   
          icon="🤖" 
          label="Virtual Sports" 
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/jackpot"    
          icon="💰" 
          label="Jackpot" 
          :hot="true" 
          :disabled="true" 
          @click="handleDisabledClick"
        />
        <SidebarLink 
          to="/promotions" 
          icon="🎁" 
          label="Promotions" 
          :disabled="true" 
          @click="handleDisabledClick"
        />
      </SidebarSection>

      <template v-if="isLoggedIn">
        <div class="sidebar__divider"></div>
        <SidebarSection label="My Account">
          <SidebarLink 
            to="/dashboard" 
            icon="📊" 
            label="Dashboard" 
            @click="handleLinkClick"
          />
          <SidebarLink 
            to="/bets"      
            icon="📋" 
            label="My Bets" 
            @click="handleLinkClick"
          />
        </SidebarSection>
      </template>
    </div>

    <div class="sidebar__footer">
      <p>BoomBet v1.0 · 18+ Only</p>
    </div>
  </aside>

  <!-- Custom Toast -->
  <Transition name="toast-fade">
    <div v-if="isToastVisible" class="custom-toast">
      <span class="toast-icon">⚠️</span>
      <span class="toast-message">{{ toastMessage }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import SidebarSection from './SidebarSection.vue'
import SidebarLink from './SidebarLink.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close-sidebar'])

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
const isMobile = ref(false)

// Toast state
const isToastVisible = ref(false)
const toastMessage = ref('This game is not played in your country at the moment')
let toastTimeout = null

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

// Handle disabled link click - shows toast ONLY
const handleDisabledClick = (event) => {
  // Prevent any navigation
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  // Show toast notification
  showToast('Not active now')
}

// Handle active link click - close sidebar on mobile
const handleLinkClick = () => {
  if (isMobile.value) {
    emit('close-sidebar')
  }
}

// Show toast notification
const showToast = (message = 'Not active now') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = message
  isToastVisible.value = true
  toastTimeout = setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--navbar-h);
  left: 0;
  bottom: 0;
  width: var(--sidebar-w);
  background: rgba(6, 8, 16, 0.98);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow: hidden;
  transition: transform 0.3s ease;
}

/* Desktop - always visible */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
    position: fixed;
    top: var(--navbar-h);
  }
}

/* Mobile styles */
.sidebar--mobile {
  transform: translateX(-100%);
  top: 0;
  z-index: 200;
}

.sidebar--mobile.sidebar--open {
  transform: translateX(0);
}

.sidebar__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.sidebar__close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.sidebar__inner {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px;
  scrollbar-width: none;
  padding-top: 12px;
}

@media (max-width: 1023px) {
  .sidebar__inner {
    padding-top: 52px;
  }
}

.sidebar__inner::-webkit-scrollbar { 
  display: none; 
}

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

/* Custom Toast */
.custom-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #EDE0BA;
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
  max-width: 90%;
}

@media (min-width: 640px) {
  .custom-toast {
    bottom: 30px;
  }
}

.toast-icon { 
  font-size: 16px; 
  flex-shrink: 0;
}

.toast-message {
  font-size: 14px;
  white-space: nowrap;
}

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