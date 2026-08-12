
<!-- sidebar.vue  -->
<template>
    <aside class="sidebar">
      <div class="sidebar__inner">
  
        <SidebarSection label="Sports">
          <SidebarLink to="/sports"           icon="⚽" label="Football" />
          <SidebarLink to="/sports?s=basket"  icon="🏀" label="Basketball" />
          <SidebarLink to="/sports?s=tennis"  icon="🎾" label="Tennis" />
          <SidebarLink to="/sports?s=cricket" icon="🏏" label="Cricket" />
          <SidebarLink to="/sports?s=rugby"   icon="🏉" label="Rugby" />
          <SidebarLink to="/sports/live"      icon="🔴" label="Live Betting" :live="true" />
        </SidebarSection>
  
        <div class="sidebar__divider"></div>
  
        <SidebarSection label="Casino">
          <SidebarLink to="/casino"           icon="🎲" label="All Games" />
          <SidebarLink to="/casino/aviator"   icon="✈️" label="Aviator"   :hot="true" />
          <SidebarLink to="/casino?g=slots"   icon="🎰" label="Slots" />
          <SidebarLink to="/casino?g=roulette"icon="🎡" label="Roulette" />
          <SidebarLink to="/casino?g=blackjack"icon="🃏"label="Blackjack" />
        </SidebarSection>
  
        <div class="sidebar__divider"></div>
  
        <SidebarSection label="More">
          <SidebarLink to="/virtuals"   icon="🤖" label="Virtual Sports" />
          <SidebarLink to="/jackpot"    icon="💰" label="Jackpot"     :hot="true" />
          <SidebarLink to="/promotions" icon="🎁" label="Promotions" />
        </SidebarSection>
  
        <template v-if="isLoggedIn">
          <div class="sidebar__divider"></div>
          <SidebarSection label="My Account">
            <SidebarLink to="/dashboard" icon="📊" label="Dashboard" />
            <SidebarLink to="/bets"      icon="📋" label="My Bets" />
          </SidebarSection>
        </template>
  
      </div>
  
      <!-- Footer -->
      <div class="sidebar__footer">
        <p>BoomBet v1.0 · 18+ Only</p>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useAuthStore } from '../../stores/authStore'
  import SidebarSection from './SidebarSection.vue'
  import SidebarLink    from './SidebarLink.vue'
  
  const authStore  = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)
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
  </style>