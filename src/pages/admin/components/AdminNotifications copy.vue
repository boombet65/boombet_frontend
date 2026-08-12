<!-- views/admin/AdminNotifications.vue -->
<template>
  <div class="space-y-6">
    <!-- Send Notification Form -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
      <h3 class="text-lg font-bold text-white mb-4">Send Notification</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Target Audience</label>
          <select v-model="notification.target" class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100">
            <option value="all">All Users</option>
            <option value="active">Active Users (Last 7 days)</option>
            <option value="new">New Users (Last 30 days)</option>
            <option value="specific">Specific User</option>
          </select>
        </div>
        
        <div v-if="notification.target === 'specific'" class="relative">
          <label class="block text-cyan-400 text-sm mb-2">Search User</label>
          <input 
            v-model="userSearch"
            type="text" 
            placeholder="Search by phone number..."
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            @input="searchSpecificUser"
          />
          <div v-if="userSearchResults.length" class="absolute z-10 w-full mt-1 bg-slate-800 border border-cyan-700 rounded-lg overflow-hidden">
            <div v-for="user in userSearchResults" :key="user.id" 
                 @click="selectUser(user)"
                 class="px-4 py-2 hover:bg-cyan-800/30 cursor-pointer text-cyan-300 text-sm">
              {{ user.phone_number }} - Balance: TZS {{ formatMoney(user.balance) }}
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Notification Type</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="radio" value="info" v-model="notification.type" class="text-cyan-500">
              <span class="text-cyan-300 text-sm">ℹ️ Info</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="success" v-model="notification.type" class="text-emerald-500">
              <span class="text-cyan-300 text-sm">✅ Success</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="warning" v-model="notification.type" class="text-yellow-500">
              <span class="text-cyan-300 text-sm">⚠️ Warning</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="promo" v-model="notification.type" class="text-purple-500">
              <span class="text-cyan-300 text-sm">🎉 Promo</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Title</label>
          <input 
            v-model="notification.title"
            type="text" 
            placeholder="e.g., Special Bonus!"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
          />
        </div>
        
        <div>
          <label class="block text-cyan-400 text-sm mb-2">Message</label>
          <textarea 
            v-model="notification.message"
            rows="4"
            placeholder="Write your notification message here..."
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 resize-none"
          ></textarea>
        </div>
        
        <div class="flex gap-3 pt-4">
          <button @click="sendNotification" :disabled="sending" class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all disabled:opacity-50">
            <span v-if="sending" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Notification</span>
          </button>
          <button @click="clearForm" class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600">
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Notifications -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
      <h3 class="text-lg font-bold text-white mb-4">Recent Notifications</h3>
      
      <div class="space-y-3">
        <div v-for="notif in recentNotifications" :key="notif.id" 
             class="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getTypeBg(notif.type)">
            <span class="text-xl">{{ getTypeIcon(notif.type) }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-white">{{ notif.title }}</p>
              <p class="text-xs text-cyan-600">{{ formatDate(notif.createdAt) }}</p>
            </div>
            <p class="text-sm text-cyan-400 mt-1">{{ notif.message }}</p>
            <p class="text-xs text-cyan-600 mt-2">Sent to: {{ notif.recipients || 'All Users' }}</p>
          </div>
        </div>
        
        <div v-if="recentNotifications.length === 0" class="text-center py-8">
          <p class="text-cyan-600">No notifications sent yet</p>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closePreview">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-white mb-4">Preview Notification</h3>
        
        <div class="bg-slate-900 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-full bg-cyan-800/50 flex items-center justify-center">
              <span class="text-2xl">📱</span>
            </div>
            <div>
              <p class="text-white font-semibold">Admin Notification</p>
              <p class="text-cyan-500 text-xs">Just now</p>
            </div>
          </div>
          <p class="text-white font-medium mb-2">{{ notification.title || 'Notification Title' }}</p>
          <p class="text-cyan-300 text-sm">{{ notification.message || 'Your notification message will appear here...' }}</p>
        </div>
        
        <button @click="closePreview" class="w-full mt-4 py-2 bg-slate-700 text-cyan-400 rounded-lg">
          Close Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationStore } from '../../../stores/notificationStore'
import { useBetStore } from '../../../stores/betStore'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const sending = ref(false)
const showPreview = ref(false)
const userSearch = ref('')
const userSearchResults = ref([])

const notification = ref({
  target: 'all',
  type: 'info',
  title: '',
  message: '',
  userId: null
})

const recentNotifications = ref([])

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString()
}

function getTypeBg(type) {
  const types = {
    info: 'bg-cyan-500/20',
    success: 'bg-emerald-500/20',
    warning: 'bg-yellow-500/20',
    promo: 'bg-purple-500/20'
  }
  return types[type] || 'bg-cyan-500/20'
}

function getTypeIcon(type) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    promo: '🎉'
  }
  return icons[type] || '📢'
}

async function searchSpecificUser() {
  if (userSearch.value.length < 3) {
    userSearchResults.value = []
    return
  }
  
  const result = await userStore.searchUsers({ query: userSearch.value })
  if (result.success) {
    userSearchResults.value = result.data.slice(0, 5)
  }
}

function selectUser(user) {
  notification.value.userId = user.id
  userSearch.value = user.phone_number
  userSearchResults.value = []
}

async function sendNotification() {
  if (!notification.value.message) {
    alert('Please enter a message')
    return
  }
  
  sending.value = true
  
  const result = await notificationStore.sendNotification(notification.value)
  
  if (result.success) {
    alert('Notification sent successfully!')
    clearForm()
    await loadRecentNotifications()
  } else {
    alert('Failed to send notification: ' + result.message)
  }
  
  sending.value = false
}

function clearForm() {
  notification.value = {
    target: 'all',
    type: 'info',
    title: '',
    message: '',
    userId: null
  }
  userSearch.value = ''
  userSearchResults.value = []
}

function openPreview() {
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
}

async function loadRecentNotifications() {
  const result = await notificationStore.getRecentNotifications()
  if (result.success) {
    recentNotifications.value = result.data
  }
}

// Preview button handler
function handlePreview() {
  openPreview()
}

// Expose preview for template
defineExpose({ openPreview })
</script>