<!-- views/admin/AdminSettings.vue -->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">⚙️ Settings</h1>
        <p class="text-cyan-400 text-sm mt-1">Manage your application settings and preferences</p>
      </div>
      <button 
        @click="saveAllSettings" 
        :disabled="saving"
        class="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="saving" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Saving...
        </span>
        <span v-else>💾 Save All Settings</span>
      </button>
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- General Settings -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <span class="text-xl">🔧</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">General Settings</h3>
            <p class="text-cyan-400 text-sm">Basic application settings</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Site Name -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Site Name</label>
            <input 
              v-model="settings.general.siteName"
              type="text" 
              placeholder="Enter site name"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <!-- Site Description -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Site Description</label>
            <textarea 
              v-model="settings.general.siteDescription"
              rows="2"
              placeholder="Enter site description"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            ></textarea>
          </div>

          <!-- Timezone -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Timezone</label>
            <select 
              v-model="settings.general.timezone"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="UTC">UTC</option>
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
              <option value="Africa/Nairobi">Africa/Nairobi</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="America/New_York">America/New York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Currency</label>
            <select 
              v-model="settings.general.currency"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="TZS">TZS - Tanzanian Shilling</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="UGX">UGX - Ugandan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <!-- Toggle: Maintenance Mode -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
            <div>
              <p class="text-white font-medium">Maintenance Mode</p>
              <p class="text-cyan-400 text-sm">Put site in maintenance mode</p>
            </div>
            <button 
              @click="settings.general.maintenanceMode = !settings.general.maintenanceMode"
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="settings.general.maintenanceMode ? 'bg-yellow-500' : 'bg-slate-600'"
            >
              <span 
                class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                :class="settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span class="text-xl">🔔</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Notification Settings</h3>
            <p class="text-cyan-400 text-sm">Configure notification preferences</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Max Notifications -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Max Notifications Per User</label>
            <input 
              v-model.number="settings.notifications.maxPerUser"
              type="number" 
              min="10"
              max="200"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <!-- Notification Retention -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Retention Period (Days)</label>
            <select 
              v-model="settings.notifications.retentionDays"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option :value="7">7 days</option>
              <option :value="14">14 days</option>
              <option :value="30">30 days</option>
              <option :value="60">60 days</option>
              <option :value="90">90 days</option>
              <option :value="0">Never delete</option>
            </select>
          </div>

          <!-- Toggles -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Email Notifications</p>
                <p class="text-cyan-400 text-sm">Send email notifications</p>
              </div>
              <button 
                @click="settings.notifications.emailEnabled = !settings.notifications.emailEnabled"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.notifications.emailEnabled ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.notifications.emailEnabled ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Push Notifications</p>
                <p class="text-cyan-400 text-sm">Send push notifications</p>
              </div>
              <button 
                @click="settings.notifications.pushEnabled = !settings.notifications.pushEnabled"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.notifications.pushEnabled ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.notifications.pushEnabled ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Sound Alerts</p>
                <p class="text-cyan-400 text-sm">Play sound for new notifications</p>
              </div>
              <button 
                @click="settings.notifications.soundEnabled = !settings.notifications.soundEnabled"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.notifications.soundEnabled ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.notifications.soundEnabled ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>

          <!-- Notification Types -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Enabled Notification Types</label>
            <div class="flex flex-wrap gap-2">
              <label 
                v-for="type in notificationTypes" 
                :key="type.value"
                class="flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer transition-all"
                :class="settings.notifications.enabledTypes.includes(type.value) ? 'bg-cyan-500/20 border border-cyan-500' : 'bg-slate-700/50 border border-transparent'"
                @click="toggleNotificationType(type.value)"
              >
                <span>{{ type.icon }}</span>
                <span class="text-sm text-cyan-100">{{ type.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <span class="text-xl">🔒</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Security Settings</h3>
            <p class="text-cyan-400 text-sm">Manage security preferences</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Session Timeout -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Session Timeout (Minutes)</label>
            <select 
              v-model="settings.security.sessionTimeout"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option :value="5">5 minutes</option>
              <option :value="15">15 minutes</option>
              <option :value="30">30 minutes</option>
              <option :value="60">1 hour</option>
              <option :value="120">2 hours</option>
              <option :value="480">8 hours</option>
            </select>
          </div>

          <!-- Max Login Attempts -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Max Login Attempts</label>
            <select 
              v-model="settings.security.maxLoginAttempts"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option :value="3">3 attempts</option>
              <option :value="5">5 attempts</option>
              <option :value="10">10 attempts</option>
              <option :value="0">Unlimited</option>
            </select>
          </div>

          <!-- Toggles -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Two-Factor Authentication</p>
                <p class="text-cyan-400 text-sm">Require 2FA for admin accounts</p>
              </div>
              <button 
                @click="settings.security.twoFactorAuth = !settings.security.twoFactorAuth"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.security.twoFactorAuth ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">IP Whitelist</p>
                <p class="text-cyan-400 text-sm">Restrict access to specific IPs</p>
              </div>
              <button 
                @click="settings.security.ipWhitelistEnabled = !settings.security.ipWhitelistEnabled"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.security.ipWhitelistEnabled ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.security.ipWhitelistEnabled ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>

          <!-- IP Whitelist Input -->
          <div v-if="settings.security.ipWhitelistEnabled">
            <label class="block text-cyan-400 text-sm mb-2">Whitelisted IPs</label>
            <textarea 
              v-model="settings.security.whitelistedIPs"
              rows="3"
              placeholder="Enter IP addresses, one per line"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            ></textarea>
            <p class="text-xs text-cyan-600 mt-1">One IP address per line</p>
          </div>
        </div>
      </div>

      <!-- System Settings -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <span class="text-xl">🖥️</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">System Settings</h3>
            <p class="text-cyan-400 text-sm">System configuration</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Log Level -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Log Level</label>
            <select 
              v-model="settings.system.logLevel"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <!-- Cache TTL -->
          <div>
            <label class="block text-cyan-400 text-sm mb-2">Cache TTL (Seconds)</label>
            <input 
              v-model.number="settings.system.cacheTTL"
              type="number" 
              min="60"
              max="86400"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <!-- Toggles -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Debug Mode</p>
                <p class="text-cyan-400 text-sm">Enable debug logging</p>
              </div>
              <button 
                @click="settings.system.debugMode = !settings.system.debugMode"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.system.debugMode ? 'bg-yellow-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.system.debugMode ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-cyan-800/30">
              <div>
                <p class="text-white font-medium">Auto Backup</p>
                <p class="text-cyan-400 text-sm">Automatically backup data</p>
              </div>
              <button 
                @click="settings.system.autoBackup = !settings.system.autoBackup"
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="settings.system.autoBackup ? 'bg-emerald-500' : 'bg-slate-600'"
              >
                <span 
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                  :class="settings.system.autoBackup ? 'translate-x-6' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>

          <!-- Backup Frequency -->
          <div v-if="settings.system.autoBackup">
            <label class="block text-cyan-400 text-sm mb-2">Backup Frequency</label>
            <select 
              v-model="settings.system.backupFrequency"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <!-- System Info -->
          <div class="mt-4 p-4 rounded-lg bg-slate-900/50 border border-cyan-800/30">
            <h4 class="text-cyan-400 text-sm font-medium mb-2">System Information</h4>
            <div class="space-y-1 text-sm">
              <p class="text-cyan-600">Version: <span class="text-cyan-300">1.0.0</span></p>
              <p class="text-cyan-600">Environment: <span class="text-cyan-300">Production</span></p>
              <p class="text-cyan-600">Last Update: <span class="text-cyan-300">{{ new Date().toLocaleString() }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-red-500/5 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
          <span class="text-xl">⚠️</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-red-400">Danger Zone</h3>
          <p class="text-red-400/70 text-sm">Irreversible actions - proceed with caution</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Clear Cache -->
        <button 
          @click="clearCache"
          class="p-4 rounded-xl bg-slate-900/50 border border-red-500/30 hover:bg-red-500/10 transition-all text-left group"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">🗑️</span>
            <div>
              <p class="text-white font-medium group-hover:text-red-400 transition-colors">Clear Cache</p>
              <p class="text-red-400/70 text-sm">Clear all cached data</p>
            </div>
          </div>
        </button>

        <!-- Reset Settings -->
        <button 
          @click="resetSettings"
          class="p-4 rounded-xl bg-slate-900/50 border border-red-500/30 hover:bg-red-500/10 transition-all text-left group"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔄</span>
            <div>
              <p class="text-white font-medium group-hover:text-red-400 transition-colors">Reset Settings</p>
              <p class="text-red-400/70 text-sm">Reset all to defaults</p>
            </div>
          </div>
        </button>

        <!-- Export Data -->
        <button 
          @click="exportData"
          class="p-4 rounded-xl bg-slate-900/50 border border-red-500/30 hover:bg-red-500/10 transition-all text-left group"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">📤</span>
            <div>
              <p class="text-white font-medium group-hover:text-red-400 transition-colors">Export Data</p>
              <p class="text-red-400/70 text-sm">Export all application data</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-2xl max-w-sm animate-slide-up" :class="toast.type === 'success' ? 'bg-emerald-900/90 border border-emerald-600' : toast.type === 'error' ? 'bg-red-900/90 border border-red-600' : 'bg-yellow-900/90 border border-yellow-600'">
      <div class="flex items-start gap-3">
        <span class="text-xl">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️' }}</span>
        <div class="flex-1">
          <p class="text-white font-medium">{{ toast.message }}</p>
          <p class="text-xs text-white/60 mt-1">{{ toast.details || '' }}</p>
        </div>
        <button @click="toast.show = false" class="text-white/60 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// State
const saving = ref(false)

// Notification types
const notificationTypes = [
  { value: 'info', label: 'Info', icon: 'ℹ️' },
  { value: 'promotion', label: 'Promotion', icon: '🎉' },
  { value: 'alert', label: 'Alert', icon: '⚠️' },
  { value: 'system', label: 'System', icon: '⚙️' }
]

// Settings data
const settings = reactive({
  general: {
    siteName: 'Boombet',
    siteDescription: 'Sports Betting Platform',
    timezone: 'Africa/Dar_es_Salaam',
    currency: 'TZS',
    maintenanceMode: false
  },
  notifications: {
    maxPerUser: 100,
    retentionDays: 30,
    emailEnabled: true,
    pushEnabled: true,
    soundEnabled: true,
    enabledTypes: ['info', 'promotion', 'alert', 'system']
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelistEnabled: false,
    whitelistedIPs: ''
  },
  system: {
    logLevel: 'info',
    cacheTTL: 3600,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  }
})

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  details: ''
})

// ============================================
// METHODS
// ============================================

function toggleNotificationType(type) {
  const index = settings.notifications.enabledTypes.indexOf(type)
  if (index > -1) {
    settings.notifications.enabledTypes.splice(index, 1)
  } else {
    settings.notifications.enabledTypes.push(type)
  }
}

function showToast(message, type = 'success', details = '') {
  toast.value = {
    show: true,
    message,
    type,
    details
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

function clearCache() {
  if (confirm('Are you sure you want to clear all cache data?')) {
    showToast('Cache cleared successfully!', 'success')
  }
}

function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
    // Reset logic here
    showToast('Settings reset to defaults', 'success')
  }
}

function exportData() {
  if (confirm('Export all application data? This may take a few moments.')) {
    showToast('Data export started', 'success', 'You will be notified when complete')
  }
}

async function saveAllSettings() {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showToast('All settings saved successfully! ✅', 'success')
  } catch (error) {
    showToast('Failed to save settings', 'error', error.message)
  } finally {
    saving.value = false
  }
}

// ============================================
// COMPUTED
// ============================================

// Optional computed properties
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}


/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}
</style>