<template>
    <div class="admin-layout">
      <!-- Admin Topbar -->
      <header class="admin-topbar">
        <div class="admin-topbar__left">
          <RouterLink to="/" class="admin-logo">
            <span class="admin-logo__icon">B</span>
            <span class="admin-logo__label">BOOMBET <span class="admin-badge">ADMIN</span></span>
          </RouterLink>
        </div>
        <div class="admin-topbar__right">
          <span class="admin-user">{{ user?.firstName }} {{ user?.lastName }}</span>
          <RouterLink to="/" class="btn btn-ghost btn-sm">← Back to Site</RouterLink>
        </div>
      </header>
  
      <!-- Body -->
      <div class="admin-body">
        <!-- Admin sidebar -->
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <RouterLink v-for="link in adminLinks" :key="link.to"
              :to="link.to" class="admin-nav__item"
              :class="{ active: route.path.startsWith(link.to) }">
              <span class="admin-nav__icon">{{ link.icon }}</span>
              {{ link.label }}
            </RouterLink>
          </nav>
        </aside>
  
        <!-- Content -->
        <main class="admin-main">
          <RouterView v-slot="{ Component, route: r }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" :key="r.fullPath" />
            </Transition>
          </RouterView>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { RouterView, RouterLink, useRoute } from 'vue-router'
  
  const route = useRoute()
  const user = computed(() => {
    const raw = localStorage.getItem('boom_user')
    return raw ? JSON.parse(raw) : null
  })
  
  const adminLinks = [
    { to: '/admin',            icon: '📊', label: 'Dashboard' },
    { to: '/admin/users',      icon: '👥', label: 'Users' },
    { to: '/admin/bets',       icon: '📋', label: 'Bets' },
    { to: '/admin/matches',    icon: '⚽', label: 'Matches' },
    { to: '/admin/jackpot',    icon: '💰', label: 'Jackpot' },
    { to: '/admin/promotions', icon: '🎁', label: 'Promotions' },
    { to: '/admin/settings',   icon: '⚙️',  label: 'Settings' },
  ]
  </script>
  
  <style scoped>
  .admin-layout {
    min-height: 100vh;
    background: var(--bg-root);
    display: flex;
    flex-direction: column;
  }
  
  .admin-topbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: var(--navbar-h);
    background: rgba(10,13,20,0.97);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    z-index: 50;
  }
  
  .admin-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .admin-logo__icon {
    width: 32px; height: 32px;
    background: var(--grad-gold);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 14px;
    color: #080b12;
  }
  .admin-logo__label {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 1px;
    display: flex; align-items: center; gap: 8px;
  }
  .admin-badge {
    font-size: 10px;
    padding: 2px 8px;
    background: rgba(255,23,68,0.15);
    color: var(--red);
    border: 1px solid rgba(255,23,68,0.3);
    border-radius: var(--radius-full);
    letter-spacing: 1px;
  }
  
  .admin-topbar__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .admin-user {
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  .admin-body {
    display: flex;
    flex: 1;
    padding-top: var(--navbar-h);
  }
  
  .admin-sidebar {
    position: fixed;
    top: var(--navbar-h);
    left: 0;
    bottom: 0;
    width: 220px;
    background: var(--bg-dark);
    border-right: 1px solid var(--border);
    padding: 16px 12px;
    overflow-y: auto;
  }
  
  .admin-nav { display: flex; flex-direction: column; gap: 2px; }
  .admin-nav__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: all var(--transition);
  }
  .admin-nav__item:hover { background: var(--border); color: var(--text-secondary); }
  .admin-nav__item.active {
    background: rgba(255,193,7,0.08);
    color: var(--gold);
    border-left: 3px solid var(--gold);
  }
  .admin-nav__icon { font-size: 16px; width: 20px; text-align: center; }
  
  .admin-main {
    flex: 1;
    margin-left: 220px;
    padding: 24px;
    overflow-x: hidden;
  }
  </style>