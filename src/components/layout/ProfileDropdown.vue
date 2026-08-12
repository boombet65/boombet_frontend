<template>
    <div class="profile-dropdown" v-click-outside="() => $emit('close')">
      <div class="profile-dropdown__header">
        <div class="profile-dropdown__avatar">{{ initials }}</div>
        <div>
          <p class="profile-dropdown__name">{{ user?.firstName }} {{ user?.lastName }}</p>
          <p class="profile-dropdown__email">{{ user?.email }}</p>
        </div>
      </div>
  
      <div class="divider" style="margin:8px 0"></div>
  
      <RouterLink to="/dashboard" class="dropdown-item" @click="$emit('close')">
        📊 Dashboard
      </RouterLink>
      <RouterLink to="/bets" class="dropdown-item" @click="$emit('close')">
        📋 My Bets
      </RouterLink>
  
      <div class="divider" style="margin:8px 0"></div>
  
      <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
        🚪 Logout
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/authStore'
  
  const emit      = defineEmits(['close'])
  const router    = useRouter()
  const authStore = useAuthStore()
  
  const user     = computed(() => authStore.user)
  const initials = computed(() => {
    const u = user.value
    if (!u) return '?'
    return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase()
  })
  
  function handleLogout() {
    authStore.logout()
    emit('close')
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .profile-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: 10px;
    z-index: 200;
  }
  
  .profile-dropdown__header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 4px;
  }
  .profile-dropdown__avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--grad-gold);
    color: #080b12;
    font-size: 13px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .profile-dropdown__name  { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .profile-dropdown__email { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 9px 10px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: all var(--transition);
    text-align: left;
  }
  .dropdown-item:hover         { background: var(--border); color: var(--text-primary); }
  .dropdown-item--danger       { color: var(--red); }
  .dropdown-item--danger:hover { background: rgba(255,23,68,0.08); }
  </style>