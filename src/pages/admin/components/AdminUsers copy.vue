<!-- views/admin/AdminUsers.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Users</p>
        <p class="text-2xl font-bold text-white">{{ totalUsers }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Active Today</p>
        <p class="text-2xl font-bold text-white">{{ activeToday }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Deposits</p>
        <p class="text-2xl font-bold text-white">TZS {{ formatMoney(totalDeposits) }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Withdrawals</p>
        <p class="text-2xl font-bold text-white">TZS {{ formatMoney(totalWithdrawals) }}</p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
      <div class="flex flex-wrap gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by phone number or name..."
          class="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
          @input="searchUsers"
        />
        <button @click="loadUsers" class="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
          Search
        </button>
        <button @click="exportUsers" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">
          Export CSV
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-900/50">
            <tr>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">User ID</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Phone Number</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Balance</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Total Bets</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Total Won</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Joined</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t border-cyan-800/30 hover:bg-slate-900/30">
              <td class="px-6 py-4 text-white text-sm font-mono">{{ user.id?.slice(0, 8) }}...</td>
              <td class="px-6 py-4 text-cyan-300 text-sm">{{ user.phone_number }}</td>
              <td class="px-6 py-4 text-yellow-400 text-sm font-bold">TZS {{ formatMoney(user.balance) }}</td>
              <td class="px-6 py-4 text-white text-sm">{{ user.totalBets || 0 }}</td>
              <td class="px-6 py-4 text-emerald-400 text-sm">TZS {{ formatMoney(user.totalWon || 0) }}</td>
              <td class="px-6 py-4 text-cyan-500 text-sm">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="openAdjustBalanceModal(user)" class="p-1 text-yellow-400 hover:text-yellow-300" title="Adjust Balance">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  <button @click="viewUserDetails(user)" class="p-1 text-cyan-400 hover:text-cyan-300" title="View Details">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="openSendMessageModal(user)" class="p-1 text-emerald-400 hover:text-emerald-300" title="Send Message">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Adjust Balance Modal -->
    <div v-if="showBalanceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeBalanceModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Adjust Balance</h3>
        <p class="text-cyan-400 mb-4">User: {{ selectedUser?.phone_number }}</p>
        <p class="text-white mb-4">Current Balance: <span class="text-yellow-400">TZS {{ formatMoney(selectedUser?.balance) }}</span></p>
        
        <div class="space-y-4">
          <select v-model="balanceAction" class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100">
            <option value="add">Add (Deposit)</option>
            <option value="deduct">Deduct (Withdraw)</option>
            <option value="set">Set Exact Amount</option>
          </select>
          
          <input 
            v-model.number="balanceAmount"
            type="number" 
            placeholder="Amount"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
          />
          
          <div class="flex gap-3">
            <button @click="confirmAdjustBalance" class="flex-1 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400">
              Confirm
            </button>
            <button @click="closeBalanceModal" class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Send Message Modal -->
    <div v-if="showMessageModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeMessageModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Send Message</h3>
        <p class="text-cyan-400 mb-4">To: {{ selectedUser?.phone_number }}</p>
        
        <div class="space-y-4">
          <input 
            v-model="messageTitle"
            type="text" 
            placeholder="Title"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
          />
          
          <textarea 
            v-model="messageBody"
            rows="4"
            placeholder="Message content..."
            class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 resize-none"
          ></textarea>
          
          <div class="flex gap-3">
            <button @click="sendMessage" class="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400">
              Send Message
            </button>
            <button @click="closeMessageModal" class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../../stores/userStore'
import { useNotificationStore } from '../../../stores/notificationStore'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const users = ref([])
const totalUsers = ref(0)
const activeToday = ref(0)
const totalDeposits = ref(0)
const totalWithdrawals = ref(0)
const searchQuery = ref('')

const showBalanceModal = ref(false)
const showMessageModal = ref(false)
const selectedUser = ref(null)
const balanceAction = ref('add')
const balanceAmount = ref(0)
const messageTitle = ref('')
const messageBody = ref('')

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString()
}

async function loadUsers() {
  const result = await userStore.getAdminUsers({ search: searchQuery.value })
  if (result.success) {
    users.value = result.data.users
    totalUsers.value = result.data.total
  }
}

async function searchUsers() {
  await loadUsers()
}

async function exportUsers() {
  const result = await userStore.exportUsers()
  if (result.success) {
    // Download CSV
    const blob = new Blob([result.data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}

function openAdjustBalanceModal(user) {
  selectedUser.value = user
  balanceAmount.value = 0
  balanceAction.value = 'add'
  showBalanceModal.value = true
}

async function confirmAdjustBalance() {
  if (!selectedUser.value || !balanceAmount.value) return
  
  let result
  if (balanceAction.value === 'add') {
    result = await userStore.addUserBalance(selectedUser.value.id, balanceAmount.value)
  } else if (balanceAction.value === 'deduct') {
    result = await userStore.deductUserBalance(selectedUser.value.id, balanceAmount.value)
  } else {
    result = await userStore.setUserBalance(selectedUser.value.id, balanceAmount.value)
  }
  
  if (result.success) {
    await loadUsers()
    closeBalanceModal()
  }
}

function closeBalanceModal() {
  showBalanceModal.value = false
  selectedUser.value = null
  balanceAmount.value = 0
}

function openSendMessageModal(user) {
  selectedUser.value = user
  messageTitle.value = ''
  messageBody.value = ''
  showMessageModal.value = true
}

async function sendMessage() {
  if (!selectedUser.value || !messageBody.value) return
  
  const result = await notificationStore.sendUserNotification({
    userId: selectedUser.value.id,
    title: messageTitle.value || 'Notification',
    message: messageBody.value,
    type: 'admin_message'
  })
  
  if (result.success) {
    closeMessageModal()
    alert('Message sent successfully!')
  }
}

function closeMessageModal() {
  showMessageModal.value = false
  selectedUser.value = null
  messageTitle.value = ''
  messageBody.value = ''
}

function viewUserDetails(user) {
  // Navigate to user details page or open modal
  console.log('View user details:', user)
}

onMounted(() => {
  loadUsers()
})
</script>