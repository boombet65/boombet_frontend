<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Fixtures Management</h1>
        <p class="text-cyan-400 text-sm">Create and manage sports fixtures for betting</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
      >
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Fixture
        </span>
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Fixtures</p>
        <p class="text-2xl font-bold text-white">{{ fixturesStore.totalFixtures }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Upcoming</p>
        <p class="text-2xl font-bold text-emerald-400">{{ upcomingCount }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Live</p>
        <p class="text-2xl font-bold text-red-400">{{ liveCount }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Finished</p>
        <p class="text-2xl font-bold text-slate-400">{{ finishedCount }}</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Bets</p>
        <p class="text-2xl font-bold text-yellow-400">{{ totalBetsOnFixtures }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fixturesStore.isLoading" class="flex justify-center py-8">
      <div class="text-cyan-400 text-lg">Loading fixtures...</div>
    </div>

    <!-- Error State -->
    <div v-if="fixturesStore.hasError" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
      {{ fixturesStore.errorMessage }}
    </div>

    <!-- Filters and Search -->
    <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
      <div class="flex flex-wrap gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search fixtures..."
          class="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
          @input="handleSearch"
        />
        <select 
          v-model="filterSport"
          class="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
        >
          <option value="">All Sports</option>
          <option value="football">⚽ Football</option>
          <option value="basketball">🏀 Basketball</option>
          <option value="tennis">🎾 Tennis</option>
          <option value="cricket">🏏 Cricket</option>
          <option value="rugby">🏉 Rugby</option>
        </select>
        <select 
          v-model="filterStatus"
          class="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
        >
          <option value="">All Status</option>
          <option value="upcoming">🟢 Upcoming</option>
          <option value="live">🔴 Live</option>
          <option value="finished">⚪ Finished</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
        <button @click="applyFilters" class="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
          Apply Filters
        </button>
        <button @click="resetFilters" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500">
          Reset
        </button>
        <button @click="refreshFixtures" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500">
          Refresh
        </button>
      </div>
    </div>

    <!-- Fixtures Table -->
    <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-900/50">
            <tr>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">ID</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Sport</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Teams</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">League</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Date & Time</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Status</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Odds</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Total Bets</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="fixturesStore.fixtures.length === 0 && !fixturesStore.isLoading">
              <td colspan="9" class="px-6 py-8 text-center text-cyan-400">
                No fixtures found
              </td>
            </tr>
            <tr v-for="fixture in fixturesStore.fixtures" :key="fixture.id" class="border-t border-cyan-800/30 hover:bg-slate-900/30">
              <td class="px-6 py-4 text-white text-sm font-mono">{{ fixture.id?.slice(0, 8) }}...</td>
              <td class="px-6 py-4 text-cyan-300 text-sm">{{ getSportIcon(fixture.sport) }} {{ fixture.sport }}</td>
              <td class="px-6 py-4">
                <div class="text-white text-sm font-bold">{{ fixture.home_team }}</div>
                <div class="text-cyan-400 text-xs">vs</div>
                <div class="text-white text-sm font-bold">{{ fixture.away_team }}</div>
              </td>
              <td class="px-6 py-4 text-cyan-300 text-sm">{{ fixture.league || 'N/A' }}</td>
              <td class="px-6 py-4 text-cyan-300 text-sm">
                <div>{{ formatDate(fixture.start_time) }}</div>
                <div class="text-cyan-500 text-xs">{{ formatTime(fixture.start_time) }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400': fixture.status === 'upcoming',
                    'bg-red-500/20 text-red-400': fixture.status === 'live',
                    'bg-slate-500/20 text-slate-400': fixture.status === 'finished',
                    'bg-red-500/20 text-red-400': fixture.status === 'cancelled'
                  }"
                >
                  {{ getStatusIcon(fixture.status) }} {{ fixture.status?.toUpperCase() || 'UNKNOWN' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="text-emerald-400 text-sm">1: {{ fixture.odds?.home || 'N/A' }}</div>
                  <div class="text-yellow-400 text-sm">X: {{ fixture.odds?.draw || 'N/A' }}</div>
                  <div class="text-red-400 text-sm">2: {{ fixture.odds?.away || 'N/A' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-yellow-400 text-sm font-bold">{{ fixture.totalBets || 0 }}</td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="editFixture(fixture)" class="p-1 text-yellow-400 hover:text-yellow-300" title="Edit Fixture">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="updateOdds(fixture)" class="p-1 text-cyan-400 hover:text-cyan-300" title="Update Odds">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-6 3v-3m-3 3h12M5 17h4m6 0h4M5 7h4m6 0h4M5 10h4m6 0h4M5 14h4m6 0h4"></path>
                    </svg>
                  </button>
                  <button @click="toggleStatus(fixture)" class="p-1 text-emerald-400 hover:text-emerald-300" title="Toggle Status">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <button @click="openDeleteModal(fixture)" class="p-1 text-red-400 hover:text-red-300" title="Delete Fixture">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <p class="text-cyan-400 text-sm">
        Showing {{ fixturesStore.fixtures.length }} of {{ fixturesStore.totalFixtures }} fixtures
      </p>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          :disabled="fixturesStore.pagination.offset === 0 || fixturesStore.isLoading"
          class="px-4 py-2 bg-slate-800 rounded-lg text-cyan-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="!fixturesStore.pagination.hasMore || fixturesStore.isLoading"
          class="px-4 py-2 bg-slate-800 rounded-lg text-cyan-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create/Edit Fixture Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white mb-4">
          {{ isEditing ? 'Edit Fixture' : 'Create New Fixture' }}
        </h3>
        
        <form @submit.prevent="saveFixture" class="space-y-4">
          <!-- Sport Selection -->
          <div>
            <label class="text-cyan-400 text-sm block mb-2">Sport *</label>
            <select 
              v-model="fixtureForm.sport"
              required
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            >
              <option value="">Select Sport</option>
              <option value="football">⚽ Football</option>
              <option value="basketball">🏀 Basketball</option>
              <option value="tennis">🎾 Tennis</option>
              <option value="cricket">🏏 Cricket</option>
              <option value="rugby">🏉 Rugby</option>
            </select>
          </div>

          <!-- Teams -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-cyan-400 text-sm block mb-2">Home Team *</label>
              <input 
                v-model="fixtureForm.home_team"
                type="text"
                required
                placeholder="e.g. Manchester United"
                class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700"
              />
            </div>
            <div>
              <label class="text-cyan-400 text-sm block mb-2">Away Team *</label>
              <input 
                v-model="fixtureForm.away_team"
                type="text"
                required
                placeholder="e.g. Liverpool"
                class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700"
              />
            </div>
          </div>

          <!-- League -->
          <div>
            <label class="text-cyan-400 text-sm block mb-2">League / Tournament</label>
            <input 
              v-model="fixtureForm.league"
              type="text"
              placeholder="e.g. Premier League"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 placeholder-cyan-700"
            />
          </div>

          <!-- Date & Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-cyan-400 text-sm block mb-2">Date *</label>
              <input 
                v-model="fixtureForm.date"
                type="date"
                required
                class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
              />
            </div>
            <div>
              <label class="text-cyan-400 text-sm block mb-2">Time *</label>
              <input 
                v-model="fixtureForm.time"
                type="time"
                required
                class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
              />
            </div>
          </div>

          <!-- Odds -->
          <div>
            <label class="text-cyan-400 text-sm block mb-2">Odds</label>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="text-emerald-400 text-xs block mb-1">Home (1)</label>
                <input 
                  v-model.number="fixtureForm.odds_home"
                  type="number"
                  step="0.01"
                  placeholder="1.95"
                  class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
                />
              </div>
              <div>
                <label class="text-yellow-400 text-xs block mb-1">Draw (X)</label>
                <input 
                  v-model.number="fixtureForm.odds_draw"
                  type="number"
                  step="0.01"
                  placeholder="3.20"
                  class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
                />
              </div>
              <div>
                <label class="text-red-400 text-xs block mb-1">Away (2)</label>
                <input 
                  v-model.number="fixtureForm.odds_away"
                  type="number"
                  step="0.01"
                  placeholder="4.50"
                  class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
                />
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="text-cyan-400 text-sm block mb-2">Status</label>
            <select 
              v-model="fixtureForm.status"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            >
              <option value="upcoming">🟢 Upcoming</option>
              <option value="live">🔴 Live</option>
              <option value="finished">⚪ Finished</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button 
              type="submit" 
              class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500"
              :disabled="fixturesStore.isLoading"
            >
              {{ fixturesStore.isLoading ? 'Saving...' : 'Save Fixture' }}
            </button>
            <button 
              type="button"
              @click="closeModal" 
              class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Odds Modal -->
    <div v-if="showOddsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeOddsModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Update Odds</h3>
        <p class="text-cyan-400 mb-2">{{ selectedFixture?.home_team }} vs {{ selectedFixture?.away_team }}</p>
        
        <div class="space-y-4">
          <div>
            <label class="text-emerald-400 text-sm block mb-1">Home (1)</label>
            <input 
              v-model.number="oddsForm.home"
              type="number"
              step="0.01"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            />
          </div>
          <div>
            <label class="text-yellow-400 text-sm block mb-1">Draw (X)</label>
            <input 
              v-model.number="oddsForm.draw"
              type="number"
              step="0.01"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            />
          </div>
          <div>
            <label class="text-red-400 text-sm block mb-1">Away (2)</label>
            <input 
              v-model.number="oddsForm.away"
              type="number"
              step="0.01"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
            />
          </div>
          
          <div class="flex gap-3">
            <button @click="confirmUpdateOdds" class="flex-1 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400">
              Update Odds
            </button>
            <button @click="closeOddsModal" class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeDeleteModal">
      <div class="bg-slate-800 rounded-2xl border border-red-700 p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-red-400 mb-4">Delete Fixture</h3>
        <p class="text-white mb-2">Are you sure you want to delete this fixture?</p>
        <p class="text-cyan-400 mb-4">{{ selectedFixture?.home_team }} vs {{ selectedFixture?.away_team }}</p>
        <p class="text-red-400 text-sm mb-4">⚠️ This action cannot be undone!</p>
        
        <div class="flex gap-3">
          <button @click="confirmDelete" class="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400">
            Delete
          </button>
          <button @click="closeDeleteModal" class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {  } from '../../../../stores/match/useMatchStore'  

// ── Store ──────────────────────────────────────────────────────────────────
const fixturesStore = useFixturesStore()

// ── Local State ────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterSport = ref('')
const filterStatus = ref('')
const searchTimeout = ref(null)

// Statistics
const upcomingCount = computed(() => {
  return fixturesStore.fixtures.filter(f => f.status === 'upcoming').length
})
const liveCount = computed(() => {
  return fixturesStore.fixtures.filter(f => f.status === 'live').length
})
const finishedCount = computed(() => {
  return fixturesStore.fixtures.filter(f => f.status === 'finished').length
})
const totalBetsOnFixtures = computed(() => {
  return fixturesStore.fixtures.reduce((sum, f) => sum + (f.totalBets || 0), 0)
})

// Modals
const showCreateModal = ref(false)
const showOddsModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedFixture = ref(null)

// Forms
const fixtureForm = ref({
  sport: '',
  home_team: '',
  away_team: '',
  league: '',
  date: '',
  time: '',
  odds_home: null,
  odds_draw: null,
  odds_away: null,
  status: 'upcoming'
})

const oddsForm = ref({
  home: null,
  draw: null,
  away: null
})

// ── Format Helpers ──────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-TZ', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

function formatTime(d) {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en-TZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function getSportIcon(sport) {
  const icons = {
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    cricket: '🏏',
    rugby: '🏉'
  }
  return icons[sport] || '🏆'
}

function getStatusIcon(status) {
  const icons = {
    upcoming: '🟢',
    live: '🔴',
    finished: '⚪',
    cancelled: '❌'
  }
  return icons[status] || '⚪'
}

// ── Load Fixtures ──────────────────────────────────────────────────────────
async function loadFixtures() {
  await fixturesStore.fetchFixtures({
    search: searchQuery.value,
    sport: filterSport.value,
    status: filterStatus.value
  })
}

async function refreshFixtures() {
  searchQuery.value = ''
  filterSport.value = ''
  filterStatus.value = ''
  await fixturesStore.resetAndFetch()
}

function handleSearch() {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    loadFixtures()
  }, 500)
}

function applyFilters() {
  loadFixtures()
}

function resetFilters() {
  searchQuery.value = ''
  filterSport.value = ''
  filterStatus.value = ''
  loadFixtures()
}

// ── Pagination ─────────────────────────────────────────────────────────────
async function nextPage() {
  await fixturesStore.loadNextPage()
}

async function prevPage() {
  if (fixturesStore.pagination.offset > 0) {
    fixturesStore.pagination.offset = fixturesStore.pagination.offset - fixturesStore.pagination.limit
    await loadFixtures()
  }
}

// ── Create / Edit Fixture ─────────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  resetForm()
  showCreateModal.value = true
}

function editFixture(fixture) {
  isEditing.value = true
  selectedFixture.value = fixture
  
  const dateObj = new Date(fixture.start_time)
  fixtureForm.value = {
    sport: fixture.sport,
    home_team: fixture.home_team,
    away_team: fixture.away_team,
    league: fixture.league || '',
    date: dateObj.toISOString().split('T')[0],
    time: dateObj.toTimeString().slice(0, 5),
    odds_home: fixture.odds?.home || null,
    odds_draw: fixture.odds?.draw || null,
    odds_away: fixture.odds?.away || null,
    status: fixture.status || 'upcoming'
  }
  showCreateModal.value = true
}

function resetForm() {
  fixtureForm.value = {
    sport: '',
    home_team: '',
    away_team: '',
    league: '',
    date: '',
    time: '',
    odds_home: null,
    odds_draw: null,
    odds_away: null,
    status: 'upcoming'
  }
}

async function saveFixture() {
  const form = fixtureForm.value
  
  // Build the fixture object
  const fixtureData = {
    sport: form.sport,
    home_team: form.home_team,
    away_team: form.away_team,
    league: form.league || null,
    start_time: new Date(`${form.date}T${form.time}`).toISOString(),
    odds: {
      home: form.odds_home || null,
      draw: form.odds_draw || null,
      away: form.odds_away || null
    },
    status: form.status
  }

  let result
  if (isEditing.value && selectedFixture.value) {
    result = await fixturesStore.updateFixture(selectedFixture.value.id, fixtureData)
  } else {
    result = await fixturesStore.createFixture(fixtureData)
  }

  if (result.success) {
    closeModal()
    alert(isEditing.value ? 'Fixture updated successfully!' : 'Fixture created successfully!')
  } else {
    alert(result.message || 'Failed to save fixture')
  }
}

function closeModal() {
  showCreateModal.value = false
  selectedFixture.value = null
  isEditing.value = false
  resetForm()
}

// ── Update Odds ────────────────────────────────────────────────────────────
function updateOdds(fixture) {
  selectedFixture.value = fixture
  oddsForm.value = {
    home: fixture.odds?.home || null,
    draw: fixture.odds?.draw || null,
    away: fixture.odds?.away || null
  }
  showOddsModal.value = true
}

async function confirmUpdateOdds() {
  if (!selectedFixture.value) return

  const result = await fixturesStore.updateFixtureOdds(
    selectedFixture.value.id,
    oddsForm.value.home,
    oddsForm.value.draw,
    oddsForm.value.away
  )

  if (result.success) {
    closeOddsModal()
    alert('Odds updated successfully!')
  } else {
    alert(result.message || 'Failed to update odds')
  }
}

function closeOddsModal() {
  showOddsModal.value = false
  selectedFixture.value = null
  oddsForm.value = { home: null, draw: null, away: null }
}

// ── Toggle Status ──────────────────────────────────────────────────────────
async function toggleStatus(fixture) {
  const statusMap = {
    upcoming: 'live',
    live: 'finished',
    finished: 'upcoming',
    cancelled: 'upcoming'
  }
  
  const newStatus = statusMap[fixture.status] || 'upcoming'
  
  if (confirm(`Change status from ${fixture.status} to ${newStatus}?`)) {
    const result = await fixturesStore.updateFixtureStatus(fixture.id, newStatus)
    if (result.success) {
      alert('Status updated successfully!')
    } else {
      alert(result.message || 'Failed to update status')
    }
  }
}

// ── Delete ──────────────────────────────────────────────────────────────────
function openDeleteModal(fixture) {
  selectedFixture.value = fixture
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedFixture.value) return

  const result = await fixturesStore.removeFixture(selectedFixture.value.id)

  if (result.success) {
    closeDeleteModal()
    alert('Fixture deleted successfully!')
  } else {
    alert(result.message || 'Failed to delete fixture')
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedFixture.value = null
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  loadFixtures()
})
</script>