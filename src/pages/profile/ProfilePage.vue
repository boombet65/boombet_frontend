<template>
  <div class="min-h-screen bg-[#020c14] pb-10">

    <!-- ══ HERO ══ -->
    <div class="relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#020c14] via-[#0a2535] to-[#020c14]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_50%,rgba(255,193,7,0.06),transparent_60%)]"></div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>

      <div class="relative max-w-4xl mx-auto px-4 py-8 flex flex-wrap items-center gap-5">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div class="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#0d3347] to-[#1a4a60] border-2 border-yellow-400/40 flex items-center justify-center shadow-[0_0_24px_rgba(255,193,7,0.15)]">
            <span class="font-mono font-black text-yellow-400 text-sm">{{ getUserInitials(user?.phone_number) }}</span>
          </div>
          <div class="absolute inset-[-4px] rounded-full border border-yellow-400/20 animate-pulse"></div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h1 class="font-['Orbitron',monospace] text-sm font-bold text-white tracking-wide truncate">
            {{ formatPhoneNumber(user?.phone_number) }}
          </h1>
          <p class="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Member since {{ formatDate(user?.created_at) }}
          </p>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-1">
          <div class="text-center">
            <span class="block font-mono font-black text-white text-sm">{{ totalBets }}</span>
            <span class="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Bets</span>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div class="text-center">
            <span class="block font-mono font-black text-emerald-400 text-sm">{{ winRate }}%</span>
            <span class="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Win Rate</span>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div class="text-center">
            <span class="block font-mono font-black text-yellow-400 text-sm">TZS {{ formatCurrency(user?.balance) }}</span>
            <span class="block text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Balance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ BODY ══ -->
    <div class="max-w-4xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">

      <!-- ── LEFT ── -->
      <div class="space-y-4">

        <!-- Balance card -->
        <div class="bg-gradient-to-br from-[#0a1e2b] to-[#0d3347] border border-yellow-400/20 rounded-2xl p-5 shadow-[0_0_32px_rgba(255,193,7,0.05)]">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Account balance</p>
          <p class="font-mono font-black text-yellow-400 text-xl mb-4 [text-shadow:0_0_20px_rgba(255,193,7,0.3)]">
            TZS {{ formatCurrency(user?.balance) }}
          </p>
          <div class="flex gap-2">
            <router-link to="/deposite"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/8 transition-opacity">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Deposite
            </router-link>
            <router-link to="/withdraw"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/8 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              Withdraw
            </router-link>
          </div>
        </div>

        <!-- Quick links -->
        <div class="bg-[#0f2d3f] border border-[#1a2030] rounded-2xl overflow-hidden">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-3 pb-2">Shortcuts</p>

          <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-3 px-4 py-3 border-t border-[#1a2030] text-slate-400 text-xs font-semibold hover:bg-[#133347] hover:text-white transition-all">
            <span class="text-base w-5 text-center">{{ link.icon }}</span>
            <span class="flex-1">{{ link.label }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-30"><path d="M9 18l6-6-6-6"/></svg>
          </router-link>

          <button @click="logoutModal = true"
            class="w-full flex items-center bg-red-500/40 gap-3 px-4 py-3 border-t border-[#1a2030] text-red-400 text-xs font-semibold hover:bg-red-500/5 transition-all">
            <span class="text-base w-5 text-center">🚪</span>
            <span class="flex-1 text-left">Logout</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="opacity-30"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- ── RIGHT ── -->
      <div class="bg-[#0f2d3f] border border-[#1a2030] rounded-2xl overflow-hidden">

        <!-- Tabs -->
        <div class="flex border-b border-[#1a2030]">
          <button v-for="tab in tabs" :key="tab.id"
            class="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-bold border-b-2 transition-all"
            :class="activeTab === tab.id
              ? 'text-yellow-400 border-yellow-400'
              : 'text-slate-500 border-transparent hover:text-slate-300'"
            @click="activeTab = tab.id">
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- ── Overview ── -->
        <div v-if="activeTab === 'overview'" class="p-5 space-y-5">

          <!-- Stat cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="s in statCards" :key="s.label"
              class="bg-[#091e2b] border border-[#1a2030] rounded-xl p-3 text-center hover:border-yellow-400/20 transition-colors">
              <div class="text-xl mb-1">{{ s.icon }}</div>
              <div class="font-mono font-black text-sm mb-0.5" :class="s.color || 'text-white'">{{ s.value }}</div>
              <div class="text-[10px] text-slate-500 uppercase tracking-wide">{{ s.label }}</div>
            </div>
          </div>

          <!-- Recent activity -->
          <div>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recently activity</p>
            <div class="space-y-2">
              <div v-for="act in recentActivity" :key="act.title"
                class="flex items-center gap-3 p-3 bg-[#091e2b] border border-[#1a2030] rounded-xl hover:border-[#242d40] transition-colors">
                <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="act.iconBg">
                  <span class="text-sm">{{ act.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-white truncate">{{ act.title }}</p>
                  <p class="text-[10px] text-slate-500 mt-0.5">{{ act.time }}</p>
                </div>
                <span class="font-mono text-xs font-black flex-shrink-0" :class="act.amountColor">{{ act.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Settings ── -->
        <div v-if="activeTab === 'settings'" class="p-5 space-y-4">
          <AppInput
            v-model="profileForm.phone_number"
            label="Namba ya Simu"
            type="tel"
            placeholder="+255 7XX XXX XXX">
            <template #prefix>📱</template>
          </AppInput>

          <AppInput
            v-model="profileForm.email"
            label="Barua Pepe (Hiari)"
            type="email"
            placeholder="example@email.com">
            <template #prefix>✉️</template>
          </AppInput>

          <AppInput
            v-model="profileForm.display_name"
            label="Jina la Kuonyesha"
            placeholder="Jina lako">
            <template #prefix>👤</template>
          </AppInput>

          <div>
            <label class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">Eneo la Saa</label>
            <select v-model="profileForm.timezone"
              class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 rounded-xl text-sm py-3 px-4 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all">
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-800 text-slate-400 hover:border-cyan-600 hover:text-white transition-all"
              @click="resetProfileForm">Ghairi</button>
            <button class="flex-1 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#083344] hover:opacity-90 transition-opacity disabled:opacity-40"
              :disabled="updatingProfile" @click="updateProfile">
              {{ updatingProfile ? 'Inahifadhi...' : 'Hifadhi' }}
            </button>
          </div>
        </div>

        <!-- ── Security ── -->
        <div v-if="activeTab === 'security'" class="p-5 space-y-4">
          <AppInput
            v-model="passwordForm.current_password"
            label="Nywila ya Sasa"
            type="password"
            placeholder="••••••••">
            <template #prefix>🔑</template>
          </AppInput>

          <AppInput
            v-model="passwordForm.new_password"
            label="Nywila Mpya"
            type="password"
            placeholder="••••••••"
            hint="Angalau herufi 6">
            <template #prefix>🔒</template>
          </AppInput>

          <AppInput
            v-model="passwordForm.confirm_password"
            label="Thibitisha Nywila Mpya"
            type="password"
            placeholder="••••••••"
            :error="passwordError">
            <template #prefix>🔒</template>
          </AppInput>

          <button class="w-full py-3 rounded-xl text-sm font-black bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#083344] hover:opacity-90 transition-opacity disabled:opacity-40"
            :disabled="updatingPassword" @click="changeUserPassword">
            {{ updatingPassword ? 'Inabadilisha...' : 'Badilisha Nywila' }}
          </button>

          <!-- Session -->
          <div class="pt-2 border-t border-[#1a2030]">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Vikao Vilivyopo</p>
            <div class="flex items-center gap-3 p-3 bg-[#091e2b] border border-[#1a2030] rounded-xl">
              <span class="text-2xl">💻</span>
              <div class="flex-1">
                <p class="text-xs font-semibold text-white">Kifaa hiki (Sasa)</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Chrome · Windows</p>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ LOGOUT MODAL ══ -->
    <AppModal v-model="logoutModal" title="Toka kwenye Akaunti" max-width="360px">
      <p class="text-sm text-cyan-400 mb-1">Una uhakika unataka kutoka?</p>
      <p class="text-xs text-slate-600">Utahitaji kuingia tena kupata akaunti yako.</p>
      <template #footer>
        <div class="flex gap-2">
          <button class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-cyan-800 text-slate-400 hover:border-cyan-600 transition-all"
            @click="logoutModal = false">Rudi</button>
          <button class="flex-1 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-red-700 to-red-500 text-white hover:opacity-90 transition-opacity"
            @click="confirmLogout">Toka</button>
        </div>
      </template>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import AppModal from '../../components/ui/AppModal.vue'
import AppInput from '../../components/ui/AppInput.vue'

const router    = useRouter()
const authStore = useAuthStore()

const activeTab        = ref('overview')
const logoutModal      = ref(false)
const updatingProfile  = ref(false)
const updatingPassword = ref(false)
const passwordError    = ref('')
const totalBets        = ref(24)
const winRate          = ref(58)

const tabs = [
  { id: 'overview', label: 'Summary', icon: '📊' },
  { id: 'settings', label: 'Arrangement', icon: '⚙️' },
  { id: 'security', label: 'Security',   icon: '🔒' },
]

const quickLinks = computed(() => {
  const links = [
    { to: '/bets',         icon: '📋', label: 'My Bets' },
    { to: '/transactions', icon: '💳', label: 'Transactions' },
    { to: '/promotions',   icon: '🎁', label: 'Promotions' },
  ]

  // Kama user yupo na role yake ni ADMIN, tunaongeza router ya Admin
  if (user.value && user.value.role === 'ADMIN') {
    links.push({ to: '/admin', icon: '🛠️', label: 'Admin Panel' }) // Nimebadilisha icon iwe ya spana/nyundo kidogo ili iendane na Admin!
  }

  return links
})

const statCards = computed(() => [
  { icon: '🎯', value: totalBets.value,    label: 'Total Patner',  color: 'text-white' },
  { icon: '✅', value: `${winRate.value}%`, label: 'Win Rate',    color: 'text-emerald-400' },
  { icon: '⚽', value: 'EPL',              label: 'Top League',  color: 'text-white' },
  { icon: '🔥', value: '3',               label: 'Win Streak',  color: 'text-yellow-400' },
])

const recentActivity = [
  { icon: '⬇️', iconBg: 'bg-emerald-500/10', title: 'Company Refund',                        time: 'more than 230 users', amount: '+TZS 50,000', amountColor: 'text-emerald-400' },
  { icon: '🎯', iconBg: 'bg-yellow-500/10',  title: 'Mantainance system',    time: '24/7',               amount: '-TZS 10,000', amountColor: 'text-red-400' },
  { icon: '⭐', iconBg: 'bg-emerald-500/10', title: 'Company license', time: '2+ years',            amount: '', amountColor: 'text-emerald-400' },
]

const profileForm = ref({
  phone_number: '', email: '', display_name: '', timezone: 'Africa/Dar_es_Salaam',
})

const passwordForm = ref({
  current_password: '', new_password: '', confirm_password: '',
})

const user = computed(() => authStore.user)

function getUserInitials(phone) {
  if (!phone) return 'U'
  return phone.replace(/\D/g, '').slice(-2)
}

function formatPhoneNumber(phone) {
  if (!phone) return 'Mgeni'
  const c = phone.replace(/\D/g, '')
  if (c.length >= 12) return `+${c.slice(0,3)} ${c.slice(3,6)} ${c.slice(6,9)} ${c.slice(9)}`
  if (c.length === 10) return `${c.slice(0,3)} ${c.slice(3,6)} ${c.slice(6)}`
  return phone
}

function formatCurrency(amount) {
  if (!amount) return '0'
  return parseFloat(amount).toLocaleString('en-TZ', { minimumFractionDigits: 2 })
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('sw-TZ', { year: 'numeric', month: 'long' })
}

function initializeFormData() {
  if (user.value) {
    profileForm.value.phone_number = user.value.phone_number || ''
    profileForm.value.email        = user.value.email || ''
    profileForm.value.display_name = user.value.display_name || formatPhoneNumber(user.value.phone_number)
  }
}

async function updateProfile() {
  updatingProfile.value = true
  try {
    const result = await authStore.updateProfile(profileForm.value)
    if (!result.success) alert(result.error || 'Imeshindwa kusasisha')
  } finally {
    updatingProfile.value = false
  }
}

async function changeUserPassword() {
  passwordError.value = ''
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    passwordError.value = 'Nywila mpya hazilingani'; return
  }
  if (passwordForm.value.new_password.length < 6) {
    passwordError.value = 'Nywila lazima iwe na herufi 6+'; return
  }
  updatingPassword.value = true
  try {
    const result = await authStore.changePassword(
      passwordForm.value.current_password,
      passwordForm.value.new_password
    )
    if (result.success) {
      passwordForm.value = { current_password: '', new_password: '', confirm_password: '' }
    } else {
      passwordError.value = result.error || 'Imeshindwa kubadilisha nywila'
    }
  } finally {
    updatingPassword.value = false
  }
}

function resetProfileForm() { initializeFormData() }

async function confirmLogout() {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  initializeFormData()
  authStore.fetchBalance?.()
})
</script>