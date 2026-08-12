<!-- views/admin/AdminNotifications.vue -->
<template>
  <div class="space-y-6">
    <!-- Send Notification Form -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
      <h3 class="text-lg font-bold text-white mb-4">Send Notification</h3>
      
      <div class="space-y-4">
        <!-- Target Audience -->
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Target Audience</label>
          <select 
            v-model="notification.target" 
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="specific">Specific User</option>
          </select>
        </div>
        
        <!-- Specific User Search -->
        <div v-if="notification.target === 'specific'" class="relative">
          <label class="block text-cyan-400 text-sm mb-2">Search User</label>
          <input 
            v-model="userSearch"
            type="text" 
            placeholder="Search by phone number..."
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            @input="debounceSearchUser"
            @keyup.enter="searchSpecificUser"
          />
          <div v-if="userSearchResults.length" class="absolute z-10 w-full mt-1 bg-slate-800 border border-cyan-700 rounded-lg overflow-hidden shadow-xl">
            <div 
              v-for="user in userSearchResults" 
              :key="user.id" 
              @click="selectUser(user)"
              class="px-4 py-2 hover:bg-cyan-800/30 cursor-pointer text-cyan-300 text-sm transition-colors"
            >
              {{ user.phone_number }} - Balance: TZS {{ formatMoney(user.balance) }}
            </div>
          </div>
          <div v-if="selectedUser" class="mt-2 p-2 bg-cyan-900/30 rounded-lg border border-cyan-700">
            <span class="text-cyan-300 text-sm">Selected: <strong>{{ selectedUser.phone_number }}</strong></span>
          </div>
        </div>
        
        <!-- Notification Type -->
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Notification Type</label>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="info" v-model="notification.type" class="text-cyan-500">
              <span class="text-cyan-300 text-sm">ℹ️ Info</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="promotion" v-model="notification.type" class="text-purple-500">
              <span class="text-cyan-300 text-sm">🎉 Promotion</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="alert" v-model="notification.type" class="text-yellow-500">
              <span class="text-cyan-300 text-sm">⚠️ Alert</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="system" v-model="notification.type" class="text-blue-500">
              <span class="text-cyan-300 text-sm">⚙️ System</span>
            </label>
          </div>
        </div>
        
        <!-- Title -->
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Title</label>
          <input 
            v-model="notification.title"
            type="text" 
            placeholder="e.g., Special Bonus!"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
        
        <!-- Message -->
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Message</label>
          <textarea 
            v-model="notification.message"
            rows="4"
            placeholder="Write your notification message here..."
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          ></textarea>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-wrap gap-3 pt-4">
          <button 
            @click="handlePreview" 
            class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 transition-all"
          >
            👁️ Preview
          </button>
          <button 
            @click="sendNotification" 
            :disabled="sending || !notification.message" 
            class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="sending" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>📤 Send Notification</span>
          </button>
          <button 
            @click="clearForm" 
            class="py-3 px-6 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-all"
          >
            ✕ Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Notifications</p>
        <p class="text-2xl font-bold text-white">{{ stats.total || 0 }}</p>
      </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-emerald-800/30 p-4">
        <p class="text-emerald-400 text-sm">Sent Today</p>
        <p class="text-2xl font-bold text-white">{{ stats.today || 0 }}</p>
      </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-800/30 p-4">
        <p class="text-purple-400 text-sm">Read Rate</p>
        <p class="text-2xl font-bold text-white">{{ stats.readRate || 0 }}%</p>
      </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-yellow-800/30 p-4">
        <p class="text-yellow-400 text-sm">Avg. Response</p>
        <p class="text-2xl font-bold text-white">{{ stats.avgResponse || 'N/A' }}</p>
      </div>
    </div>

    <!-- Recent Notifications -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white">Recent Notifications</h3>
        <button 
          @click="loadRecentNotifications" 
          :disabled="isLoading"
          class="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
      
      <div v-if="isLoading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 mx-auto text-cyan-500" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="notif in recentNotifications" 
          :key="notif.id" 
          class="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors"
        >
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="getTypeBg(notif.type)">
            <span class="text-xl">{{ getTypeIcon(notif.type) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="font-semibold text-white truncate">{{ notif.title || 'No Title' }}</p>
              <p class="text-xs text-cyan-600 flex-shrink-0">{{ formatDate(notif.created_at || notif.createdAt) }}</p>
            </div>
            <p class="text-sm text-cyan-400 mt-1 break-words">{{ notif.message }}</p>
            <div class="flex flex-wrap items-center gap-4 mt-2">
              <p class="text-xs text-cyan-600">To: {{ notif.recipients || notif.phone_number || 'All Users' }}</p>
              <span v-if="notif.is_read !== undefined" class="text-xs px-2 py-1 rounded-full" :class="notif.is_read ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'">
                {{ notif.is_read ? '✓ Read' : '○ Unread' }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="recentNotifications.length === 0" class="text-center py-8">
          <p class="text-cyan-600">No notifications sent yet</p>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" @click.self="closePreview">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-sm mx-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-4">📱 Preview Notification</h3>
        
        <div class="bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-full bg-cyan-800/50 flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">{{ getTypeIcon(notification.type) || '📱' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold truncate">Admin Notification</p>
              <p class="text-cyan-500 text-xs">Just now</p>
            </div>
          </div>
          <p class="text-white font-medium mb-2 break-words">{{ notification.title || 'Notification Title' }}</p>
          <p class="text-cyan-300 text-sm break-words">{{ notification.message || 'Your notification message will appear here...' }}</p>
        </div>
        
        <div class="flex gap-3 mt-4">
          <button @click="closePreview" class="flex-1 py-2 bg-slate-700 text-cyan-400 rounded-lg hover:bg-slate-600 transition-colors">
            Close
          </button>
          <button @click="sendFromPreview" class="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-300 transition-colors">
            Send Now
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-2xl max-w-sm" :class="toast.type === 'success' ? 'bg-emerald-900/90 border border-emerald-600' : 'bg-red-900/90 border border-red-600'">
      <p class="text-white font-medium">{{ toast.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNotificationStore } from '@/store/notifications.store'
import { useAuthStore } from '@/store/authStore'
import notificationService from '@/services/notifications.service'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()

// State
const sending = ref(false)
const isLoading = ref(false)
const showPreview = ref(false)
const userSearch = ref('')
const userSearchResults = ref([])
const selectedUser = ref(null)
let searchTimeout = null

const notification = ref({
  target: 'all',
  type: 'info',
  title: '',
  message: '',
  userId: null,
  metadata: null
})

const recentNotifications = ref([])

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Stats
const stats = ref({
  total: 0,
  today: 0,
  readRate: 0,
  avgResponse: 'N/A'
})

// Computed
const isFormValid = computed(() => {
  if (!notification.value.message) return false
  if (notification.value.target === 'specific' && !notification.value.userId) return false
  return true
})

// Methods
function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-TZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeBg(type) {
  const types = {
    info: 'bg-cyan-500/20',
    promotion: 'bg-purple-500/20',
    alert: 'bg-yellow-500/20',
    system: 'bg-blue-500/20',
    success: 'bg-emerald-500/20',
    warning: 'bg-yellow-500/20',
    promo: 'bg-purple-500/20'
  }
  return types[type] || 'bg-cyan-500/20'
}

function getTypeIcon(type) {
  const icons = {
    info: 'ℹ️',
    promotion: '🎉',
    alert: '⚠️',
    system: '⚙️',
    success: '✅',
    warning: '⚠️',
    promo: '🎉'
  }
  return icons[type] || '📢'
}

// Debounce search
function debounceSearchUser() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchSpecificUser()
  }, 500)
}

async function searchSpecificUser() {
  if (userSearch.value.length < 3) {
    userSearchResults.value = []
    return
  }
  
  try {
    // Use notification service directly to check user
    const result = await notificationService.checkUser(userSearch.value)
    if (result.success && result.data) {
      // If user exists, show in results
      userSearchResults.value = [{
        id: result.data.user_id || result.data.id,
        phone_number: result.data.phone_number,
        balance: result.data.balance || 0
      }]
    } else {
      userSearchResults.value = []
      showToast('User not found', 'error')
    }
  } catch (error) {
    userSearchResults.value = []
    showToast('User not found', 'error')
  }
}

function selectUser(user) {
  selectedUser.value = user
  notification.value.userId = user.id
  userSearch.value = user.phone_number
  userSearchResults.value = []
  showToast(`User ${user.phone_number} selected`, 'success')
}

async function sendNotification() {
  if (!notification.value.message) {
    showToast('Please enter a message', 'error')
    return
  }
  
  if (notification.value.target === 'specific' && !notification.value.userId) {
    showToast('Please select a user first', 'error')
    return
  }
  
  sending.value = true
  
  try {
    let result
    
    if (notification.value.target === 'all') {
      // Send to all users
      result = await notificationStore.sendToAllUsers({
        title: notification.value.title || 'Notification',
        message: notification.value.message,
        type: notification.value.type,
        metadata: notification.value.metadata
      })
    } else {
      // Send to specific user
      const phoneNumber = selectedUser.value?.phone_number
      if (!phoneNumber) {
        showToast('User phone number not found', 'error')
        sending.value = false
        return
      }
      
      result = await notificationStore.sendToUser({
        phone_number: phoneNumber,
        title: notification.value.title || 'Notification',
        message: notification.value.message,
        type: notification.value.type,
        metadata: notification.value.metadata
      })
    }
    
    if (result.success) {
      showToast('Notification sent successfully! ✅', 'success')
      clearForm()
      await loadRecentNotifications()
    } else {
      showToast('Failed to send: ' + (result.message || 'Unknown error'), 'error')
    }
  } catch (error) {
    showToast('Error: ' + (error.message || 'Failed to send notification'), 'error')
  } finally {
    sending.value = false
    closePreview()
  }
}

function clearForm() {
  notification.value = {
    target: 'all',
    type: 'info',
    title: '',
    message: '',
    userId: null,
    metadata: null
  }
  userSearch.value = ''
  userSearchResults.value = []
  selectedUser.value = null
}

async function loadRecentNotifications() {
  isLoading.value = true
  try {
    // Get all notifications with limit
    const result = await notificationStore.getAllNotifications({
      limit: 50,
      offset: 0
    })
    
    if (result.success) {
      // Handle different response structures
      let notifications = []
      if (result.data?.notifications) {
        notifications = result.data.notifications
      } else if (Array.isArray(result.data)) {
        notifications = result.data
      } else if (result.data?.data) {
        notifications = result.data.data
      }
      
      recentNotifications.value = notifications
      
      // Update stats
      stats.value.total = result.data?.total || notifications.length
      
      // Calculate today's count
      const today = new Date().toDateString()
      stats.value.today = notifications.filter(n => {
        const date = new Date(n.created_at || n.createdAt)
        return date.toDateString() === today
      }).length
      
      // Calculate read rate
      const readCount = notifications.filter(n => n.is_read).length
      stats.value.readRate = notifications.length > 0 
        ? Math.round((readCount / notifications.length) * 100) 
        : 0
    }
  } catch (error) {
    console.error('Failed to load notifications:', error)
    showToast('Failed to load notifications', 'error')
  } finally {
    isLoading.value = false
  }
}

function handlePreview() {
  if (!notification.value.message) {
    showToast('Please write a message first', 'error')
    return
  }
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
}

function sendFromPreview() {
  closePreview()
  sendNotification()
}

function showToast(message, type = 'success') {
  toast.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// Lifecycle
onMounted(() => {
  loadRecentNotifications()
})
</script>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>