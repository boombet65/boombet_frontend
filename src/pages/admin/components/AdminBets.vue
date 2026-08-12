<!-- views/admin/AdminBets.vue -->
<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 p-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="filters.status" class="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="SETTLED">Settled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <select v-model="filters.result" class="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm">
          <option value="">All Results</option>
          <option value="PENDING">Pending</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
        
        <input 
          v-model="filters.search"
          type="text" 
          placeholder="Search by user or bet ID..."
          class="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
        />
        
        <button @click="loadBets" class="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors">
          Search
        </button>
      </div>
    </div>

    <!-- Bets Table -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-900/50">
            <tr>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Bet ID</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">User</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Selections</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Stake</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Potential Win</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Status</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bet in bets" :key="bet.id" class="border-t border-cyan-800/30 hover:bg-slate-900/30 transition-colors">
              <td class="px-6 py-4 text-white text-sm font-mono">#{{ bet.id }}</td>
              <td class="px-6 py-4 text-cyan-300 text-sm">{{ bet.user?.phone_number || 'N/A' }}</td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-for="(sel, idx) in bet.selections?.slice(0, 2)" :key="idx" class="text-xs text-cyan-400">
                    {{ sel.match?.name || sel.matchName }}
                  </div>
                  <span v-if="bet.selections?.length > 2" class="text-xs text-cyan-600">+{{ bet.selections.length - 2 }} more</span>
                </div>
              </td>
              <td class="px-6 py-4 text-yellow-400 text-sm font-bold">TZS {{ formatMoney(bet.stake) }}</td>
              <td class="px-6 py-4 text-emerald-400 text-sm font-bold">TZS {{ formatMoney(bet.potentialReturn) }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(bet)">
                  {{ bet.status }} · {{ bet.result }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="viewBetDetails(bet)" class="p-1 text-cyan-400 hover:text-cyan-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button v-if="bet.status === 'OPEN' && bet.result === 'PENDING'" 
                          @click="openSettleModal(bet)" 
                          class="p-1 text-yellow-400 hover:text-yellow-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-cyan-800/30">
        <p class="text-sm text-cyan-500">Showing {{ bets.length }} of {{ total }} bets</p>
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded-lg bg-slate-900 text-cyan-400 disabled:opacity-50">
            Previous
          </button>
          <button @click="nextPage" :disabled="page * limit >= total" class="px-3 py-1 rounded-lg bg-slate-900 text-cyan-400 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Settle Bet Modal -->
    <div v-if="showSettleModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeSettleModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Settle Bet</h3>
        <p class="text-cyan-400 mb-4">Bet #{{ selectedBet?.id }}</p>
        
        <div class="space-y-4">
          <div class="bg-slate-900 rounded-xl p-4">
            <div class="flex justify-between mb-2">
              <span class="text-cyan-400">Stake:</span>
              <span class="text-white font-bold">TZS {{ formatMoney(selectedBet?.stake) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-cyan-400">Potential Win:</span>
              <span class="text-emerald-400 font-bold">TZS {{ formatMoney(selectedBet?.potentialReturn) }}</span>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button @click="confirmSettle('WON')" class="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">
              ✅ Won
            </button>
            <button @click="confirmSettle('LOST')" class="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">
              ❌ Lost
            </button>
          </div>
          
          <button @click="closeSettleModal" class="w-full py-2 text-cyan-400 hover:text-cyan-300">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBetStore } from '../../../stores/betStore'
import { useRouter } from 'vue-router'

const betStore = useBetStore()
const router = useRouter()

const bets = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const showSettleModal = ref(false)
const selectedBet = ref(null)

const filters = ref({
  status: '',
  result: '',
  search: ''
})

function formatMoney(n) {
  return new Intl.NumberFormat('en-TZ').format(n || 0)
}

function getStatusClass(bet) {
  if (bet.result === 'WON') return 'bg-emerald-500/20 text-emerald-400'
  if (bet.result === 'LOST') return 'bg-red-500/20 text-red-400'
  if (bet.status === 'OPEN') return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-cyan-500/20 text-cyan-400'
}

async function loadBets() {
  const result = await betStore.loadAdminBets({
    ...filters.value,
    page: page.value,
    limit: limit.value
  })
  if (result.success) {
    bets.value = result.data.bets
    total.value = result.data.total
  }
}

function openSettleModal(bet) {
  selectedBet.value = bet
  showSettleModal.value = true
}

function closeSettleModal() {
  showSettleModal.value = false
  selectedBet.value = null
}

async function confirmSettle(result) {
  if (!selectedBet.value) return
  
  await betStore.settleBet(selectedBet.value.id, result)
  closeSettleModal()
  loadBets()
}

function viewBetDetails(bet) {
  router.push(`/admin/bets/${bet.id}`)
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    loadBets()
  }
}

function nextPage() {
  if (page.value * limit.value < total.value) {
    page.value++
    loadBets()
  }
}

onMounted(() => {
  loadBets()
})
</script>