<!-- layouts/AdminLayout.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
    <!-- Sidebar -->
    <aside 
      class="fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-sm border-r border-cyan-800/50 transition-all duration-300 z-50"
      :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-cyan-800/50">
        <div 
          class="flex items-center gap-3 cursor-pointer"
          @click="router.push('/')"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <span class="text-xl">🎲</span>
          </div>
          <span v-if="!isSidebarCollapsed" class="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-cyan-800/30 transition-colors"
        >
          <svg class="w-5 h-5 text-cyan-400" :class="{ 'rotate-180': isSidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl text-cyan-400 hover:bg-cyan-800/30 transition-all duration-200 group"
          :class="{ 'bg-cyan-800/40 text-yellow-400': isActive(item.path) }"
        >
          <span class="text-xl min-w-[32px] text-center">{{ item.icon }}</span>
          <span v-if="!isSidebarCollapsed" class="text-sm font-medium">{{ item.label }}</span>
          <div v-if="isSidebarCollapsed" class="absolute left-20 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-cyan-800/50">
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span class="text-xl min-w-[32px] text-center">🚪</span>
          <span v-if="!isSidebarCollapsed" class="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="transition-all duration-300" :class="isSidebarCollapsed ? 'ml-20' : 'ml-64'">
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-cyan-800/50">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h1 class="text-2xl font-bold text-white">{{ pageTitle }}</h1>
            <p class="text-sm text-cyan-400 mt-1">{{ pageSubtitle }}</p>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-cyan-800/30 transition-colors">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Admin Profile -->
            <div class="flex items-center gap-3">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-white">{{ adminName }}</p>
                <p class="text-xs text-cyan-400">Administrator</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <span class="text-lg">👑</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' 
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)


onMounted(async () => {
  console.log('🔐 AdminLayout mounted')
  
  // Kama hajalogin, jaribu initialize
  if (!authStore.isLoggedIn) {
    await authStore.initialize()
  }
  
  // Kama bado hajalogin, peleka login
  if (!authStore.isLoggedIn) {
    console.log('Not logged in, redirecting to login')
    router.push('/login')
  } else {
    console.log('✅ Admin authenticated:', authStore.user?.phone_number)
  }
})

const navItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/bets', icon: '🎲', label: 'Bets Management' },
  { path: '/admin/users', icon: '👥', label: 'Users Management' },
  { path: '/admin/notifications', icon: '🔔', label: 'Send Notification' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { path: '/admin/fixtures', icon: '', label: 'Fixctures' },
]

const pageTitles = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of platform performance' },
  '/admin/bets': { title: 'Bets Management', subtitle: 'Manage and settle bets' },
  '/admin/users': { title: 'Users Management', subtitle: 'View and manage users' },
  '/admin/notifications': { title: 'Send Notification', subtitle: 'Send push notifications to users' },
  '/admin/settings': { title: 'Settings', subtitle: 'Configure admin settings' },
  '/admin/fixctures': { title: 'Fixcture', subtitle: 'Configure admin add Fixcture' },
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageSubtitle = computed(() => pageTitles[route.path]?.subtitle || '')

const adminName = computed(() => authStore.user?.phone_number || 'Admin User')

function isActive(path) {
  return route.path.startsWith(path)
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>