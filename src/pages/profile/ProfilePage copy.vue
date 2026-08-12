<template>
    <div class=" bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="bg-gradient-to-r from-purple-600 to-blue-500 rounded-full p-2 animate-pulse">
          <div class="bg-white rounded-full p-4">
            <svg class="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-2  py-8">
        <!-- Welcome Header -->
        <div class="mb-8">
          <h1 class="text-sm font-bold text-lime-400 mb-2 animate-fadeIn">
            Welcome Back,
            <!-- {{ formatPhoneNumber(user?.phone_number) }} -->
          </h1>
          <p class="text-gray-400 animate-slideUp">Manage your account and betting preferences</p>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - User Info Card -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Profile Card -->
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
              <div class="relative">
                <!-- Cover Image -->
                <div class="h-10 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-700 "></div>
                
                <!-- Avatar -->
                <div class="absolute -bottom-12 left-6">
                  <div class="relative">
                    <div class="w-16 h-16 rounded-full border-4 border-gray-800 bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-xl">
                      <span class="text-xs font-bold text-white">
                        {{ getUserInitials(user?.phone_number) }}
                      </span>
                    </div>
                    <button class="absolute bottom-0 right-0 bg-slate-600 rounded-full p-1 hover:bg-purple-700 transition-all duration-200">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
  
              <div class="pt-10 pb-2 px-2">
                <h2 class="text-sm  pt-2 font-bold text-white ">{{ formatPhoneNumber(user?.phone_number) }}</h2>
                <p class="text-gray-400 text-sm mb-4">Member since {{ formatDate(user?.created_at) }}</p>
                
                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 pt-1 border-t border-gray-700">
                  <div class="text-center">
                    <p class="text-sm font-bold text-purple-400">{{ totalBets || 0 }}</p>
                    <p class="text-xs text-gray-400">Total Bets</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-bold text-green-400">{{ winRate || 0 }}%</p>
                    <p class="text-xs text-gray-400">Win Rate</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Balance Card -->
            <div class="bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-700 rounded-2xl shadow-xl p-2 transform transition-all duration-300 hover:scale-105">
              <div class="flex items-center justify-between mb-0">
                <h3 class="text-white text-sm font-semibold">Total Balance</h3>
                <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-sm font-bold text-white mb-1">
                TZS {{ formatCurrency(user?.balance) }}
              </p>
              <div class="flex gap-2 mt-2">
                <button class="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200">
                  Deposit
                </button>
                <button class="flex-1 text-xs bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                  Withdraw
                </button>
              </div>
            </div>
  
            <!-- Quick Actions -->
            <div class="bg-gray-800 rounded-2xl shadow-xl px-2 py-2 border border-gray-700">
              <h3 class="text-white font-semibold mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button class="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group">
                  <span class="text-gray-300 group-hover:text-white">Transaction History</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button class="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group">
                  <span class="text-gray-300 group-hover:text-white">Betting History</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button class="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group">
                  <span class="text-gray-300 group-hover:text-white">Responsible Gaming</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Right Column - Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Tabs -->
            <div class="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
              <div class="border-b border-gray-700">
                <div class="flex space-x-8 px-6">
                  <button 
                    @click="activeTab = 'overview'"
                    :class="[
                      'py-4 text-sm font-medium transition-all duration-200 relative',
                      activeTab === 'overview' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
                    ]"
                  >
                    Overview
                    <div v-if="activeTab === 'overview'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                  </button>
                  <button 
                    @click="activeTab = 'settings'"
                    :class="[
                      'py-4 text-sm font-medium transition-all duration-200 relative',
                      activeTab === 'settings' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
                    ]"
                  >
                    Settings
                    <div v-if="activeTab === 'settings'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                  </button>
                  <button 
                    @click="activeTab = 'security'"
                    :class="[
                      'py-4 text-sm font-medium transition-all duration-200 relative',
                      activeTab === 'security' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
                    ]"
                  >
                    Security
                    <div v-if="activeTab === 'security'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                  </button>
                </div>
              </div>
  
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="p-6">
                <!-- Recent Activity -->
                <h3 class="text-white font-semibold mb-4">Recent Activity</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-white font-medium">Deposit</p>
                        <p class="text-gray-400 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <p class="text-green-400 font-semibold">+TZS 50,000</p>
                  </div>
  
                  <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-white font-medium">Bet Placed</p>
                        <p class="text-gray-400 text-xs">Yesterday</p>
                      </div>
                    </div>
                    <p class="text-red-400 font-semibold">-TZS 10,000</p>
                  </div>
                </div>
  
                <!-- Betting Stats -->
                <div class="mt-6">
                  <h3 class="text-white font-semibold mb-4">Betting Statistics</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-700/50 rounded-lg p-4">
                      <p class="text-gray-400 text-sm mb-2">Most Bet On</p>
                      <p class="text-white font-semibold">Premier League</p>
                      <p class="text-purple-400 text-xs mt-1">12 bets placed</p>
                    </div>
                    <div class="bg-gray-700/50 rounded-lg p-4">
                      <p class="text-gray-400 text-sm mb-2">Favorite Sport</p>
                      <p class="text-white font-semibold">Football</p>
                      <p class="text-purple-400 text-xs mt-1">85% of bets</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Settings Tab -->
              <div v-if="activeTab === 'settings'" class="p-6">
                <form @submit.prevent="updateProfile" class="space-y-5">
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      v-model="profileForm.phone_number"
                      type="tel"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter phone number"
                    />
                  </div>
  
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Email (Optional)</label>
                    <input 
                      v-model="profileForm.email"
                      type="email"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
  
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Display Name</label>
                    <input 
                      v-model="profileForm.display_name"
                      type="text"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter display name"
                    />
                  </div>
  
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Time Zone</label>
                    <select 
                      v-model="profileForm.timezone"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</option>
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
  
                  <div class="flex gap-3 pt-4">
                    <button type="submit" :disabled="updatingProfile" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 disabled:opacity-50">
                      {{ updatingProfile ? 'Saving...' : 'Save Changes' }}
                    </button>
                    <button type="button" @click="resetProfileForm" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
  
              <!-- Security Tab -->
              <div v-if="activeTab === 'security'" class="p-6">
                <form @submit.prevent="changeUserPassword" class="space-y-5">
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                    <input 
                      v-model="passwordForm.current_password"
                      type="password"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>
  
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                    <input 
                      v-model="passwordForm.new_password"
                      type="password"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
  
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                    <input 
                      v-model="passwordForm.confirm_password"
                      type="password"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
  
                  <div v-if="passwordError" class="bg-red-500/10 border border-red-500 rounded-lg p-3">
                    <p class="text-red-400 text-sm">{{ passwordError }}</p>
                  </div>
  
                  <button type="submit" :disabled="updatingPassword" class="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 disabled:opacity-50">
                    {{ updatingPassword ? 'Updating...' : 'Update Password' }}
                  </button>
                </form>
  
                <!-- Session Management -->
                <div class="mt-8 pt-6 border-t border-gray-700">
                  <h3 class="text-white font-semibold mb-4">Active Sessions</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-white font-medium">Current Session (This device)</p>
                          <p class="text-gray-400 text-xs">Chrome on Windows</p>
                        </div>
                      </div>
                      <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Logout Button -->
            <button 
              @click="handleLogout"
              class="w-full bg-red-600/20 hover:bg-red-700/15 cursor-pointer text-red-400 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 border border-red-600/30"
            >
              Logout Account
            </button>
          
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const loading = ref(false) // Changed to false initially
  const updatingProfile = ref(false)
  const updatingPassword = ref(false)
  const activeTab = ref('overview')
  const passwordError = ref('')
  const totalBets = ref(0)
  const winRate = ref(0)
  
  // Form data
  const profileForm = ref({
    phone_number: '',
    email: '',
    display_name: '',
    timezone: 'Africa/Dar_es_Salaam'
  })
  
  const passwordForm = ref({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  // Computed
  const user = computed(() => authStore.user)
  
  // Methods
  const getUserInitials = (phone) => {
    if (!phone) return 'U'
    const numbers = phone.replace(/\D/g, '').slice(-4)
    return numbers
  }
  
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Guest'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    }
    if (cleaned.length === 12) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4')
    }
    return cleaned
  }
  
  const formatCurrency = (amount) => {
    if (!amount) return '0'
    return parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }
  
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }
  
  // NO API call needed - data already in store!
  const initializeFormData = () => {
    // Just populate form from existing store data
    if (user.value) {
      profileForm.value.phone_number = user.value.phone_number || ''
      profileForm.value.email = user.value.email || ''
      profileForm.value.display_name = user.value.display_name || formatPhoneNumber(user.value.phone_number)
    }
  }
  
  const updateProfile = async () => {
    updatingProfile.value = true
    try {
      const result = await authStore.updateProfile({
        phone_number: profileForm.value.phone_number,
        email: profileForm.value.email,
        display_name: profileForm.value.display_name,
        timezone: profileForm.value.timezone
      })
      
      if (result.success) {
        alert('Profile updated successfully!')
      } else {
        alert(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert('An error occurred while updating profile')
    } finally {
      updatingProfile.value = false
    }
  }
  
  const changeUserPassword = async () => {
    passwordError.value = ''
    
    if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
      passwordError.value = 'New passwords do not match'
      return
    }
    
    if (passwordForm.value.new_password.length < 6) {
      passwordError.value = 'Password must be at least 6 characters'
      return
    }
    
    updatingPassword.value = true
    
    try {
      const result = await authStore.changePassword(
        passwordForm.value.current_password,
        passwordForm.value.new_password
      )
      
      if (result.success) {
        alert('Password changed successfully!')
        passwordForm.value = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        }
      } else {
        passwordError.value = result.error || 'Failed to change password'
      }
    } catch (error) {
      console.error('Change password error:', error)
      passwordError.value = 'An error occurred while changing password'
    } finally {
      updatingPassword.value = false
    }
  }
  
  const resetProfileForm = () => {
    profileForm.value = {
      phone_number: user.value?.phone_number || '',
      email: user.value?.email || '',
      display_name: user.value?.display_name || formatPhoneNumber(user.value?.phone_number),
      timezone: 'Africa/Dar_es_Salaam'
    }
  }
  
  const handleLogout = async () => {
    const confirmed = confirm('Are you sure you want to logout?')
    if (confirmed) {
      await authStore.logout()
      router.push('/')
    }
  }
  
  // Optional: Silent background balance update (don't show loading)
  const refreshBalanceSilently = async () => {
    // This is optional - you can call it but without loading state
    try {
      await authStore.fetchBalance()
    } catch (error) {
      console.debug('Background balance refresh failed:', error)
    }
  }
  
  // Load data on mount - NO LOADING STATE
  onMounted(() => {
    initializeFormData()
    // Optional: Refresh balance in background without blocking UI
    refreshBalanceSilently()
  })
  </script>
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.5s ease-out;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
  </style>