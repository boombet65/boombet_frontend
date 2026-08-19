<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white">Fixtures Management</h1>
        <p class="text-cyan-400 text-xs sm:text-sm">Create and manage sports fixtures for betting</p>
      </div>
      <div class="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        <button 
          @click="openCreateModal" 
          class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20 text-sm sm:text-base"
        >
          <span class="flex items-center justify-center gap-1 sm:gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="hidden xs:inline">Create</span>
            <span class="xs:hidden">New</span>
          </span>
        </button>
        <button 
          @click="openBulkModal" 
          class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
        >
          <span class="flex items-center justify-center gap-1 sm:gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="hidden xs:inline">Bulk</span>
            <span class="xs:hidden">Upload</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <FixturesStats 
      :total="totalFixtures"
      :upcoming="upcomingCount"
      :live="liveCount"
      :finished="finishedCount"
      :total-bets="totalBetsOnFixtures"
    />

    <!-- Loading / Error -->
    <div v-if="matchStore.loading" class="flex justify-center py-8">
      <div class="text-cyan-400 text-lg">Loading fixtures...</div>
    </div>
    <div v-if="matchStore.error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
      {{ matchStore.error }}
    </div>

    <!-- Filters -->
    <FixturesFilter 
      v-model:search="searchQuery"
      v-model:sport="filterSport"
      v-model:status="filterStatus"
      @apply="applyFilters"
      @reset="resetFilters"
      @refresh="refreshFixtures"
    />

    <!-- Table -->
    <FixturesTable 
      :fixtures="allMatches"
      :loading="matchStore.loading"
      @view="openViewModal"
      @edit="editFixture"
      @odds="openUpdateOdds"
      @status="toggleStatus"
      @delete="openDeleteModal"
    />

    <!-- Modals -->
    <ViewFixtureModal 
      v-model="showViewModal" 
      :fixture="selectedFixture" 
      @close="closeViewModal" 
    />
    <FixtureFormModal 
      v-model="showCreateModal" 
      :editing="isEditing" 
      :fixture="selectedFixture" 
      :loading="matchStore.actionLoading"
      @save="handleSaveFixture" 
      @close="closeModal" 
    />
    <BulkUploadModal 
      v-model="showBulkModal" 
      :loading="matchStore.actionLoading"
      @created="handleBulkCreated" 
      @close="closeBulkModal" 
    />
    <OddsModal 
      v-model="showOddsModal" 
      :fixture="selectedFixture" 
      :loading="matchStore.actionLoading"
      @update="handleUpdateOdds" 
      @close="closeOddsModal" 
    />
    <DeleteModal 
      v-model="showDeleteModal" 
      :fixture="selectedFixture" 
      :loading="matchStore.actionLoading"
      @confirm="handleDelete" 
      @close="closeDeleteModal" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMatchStore } from '../../../../stores/match/useMatchStore'

// Components
import FixturesStats from './components/FixturesStats.vue'
import FixturesFilter from './components/FixturesFilter.vue'
import FixturesTable from './components/FixturesTable.vue'
import ViewFixtureModal from './components/ViewFixtureModal.vue'
import FixtureFormModal from './components/FixtureFormModal.vue'
import BulkUploadModal from './components/BulkUploadModal.vue'
import OddsModal from './components/OddsModal.vue'
import DeleteModal from './components/DeleteModal.vue'

const matchStore = useMatchStore()

// ── Computed ──────────────────────────────────────────────────────────────
const allMatches = computed(() => [...matchStore.upcomingMatches, ...matchStore.liveMatches])

const totalFixtures = computed(() => allMatches.value.length)
const upcomingCount = computed(() => allMatches.value.filter(f => f.status === 'UPCOMING').length)
const liveCount = computed(() => allMatches.value.filter(f => f.status === 'LIVE').length)
const finishedCount = computed(() => allMatches.value.filter(f => f.status === 'FINISHED').length)
const totalBetsOnFixtures = computed(() => allMatches.value.reduce((sum, f) => sum + (f.totalBets || 0), 0))

// ── State ──────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterSport = ref('')
const filterStatus = ref('')
const searchTimeout = ref(null)

// Modals
const showViewModal = ref(false)
const showCreateModal = ref(false)
const showBulkModal = ref(false)
const showOddsModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedFixture = ref(null)

// ── Load ───────────────────────────────────────────────────────────────────
async function loadFixtures() {
  await matchStore.fetchAllMatches()
}

async function refreshFixtures() {
  searchQuery.value = ''
  filterSport.value = ''
  filterStatus.value = ''
  await matchStore.fetchAllMatches()
}

function handleSearch() {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(loadFixtures, 500)
}

function applyFilters() { loadFixtures() }

function resetFilters() {
  searchQuery.value = ''
  filterSport.value = ''
  filterStatus.value = ''
  loadFixtures()
}

// ── View ──────────────────────────────────────────────────────────────────
function openViewModal(fixture) {
  selectedFixture.value = fixture
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedFixture.value = null
}

// ── Single Match ──────────────────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  selectedFixture.value = null
  showCreateModal.value = true
}

function editFixture(fixture) {
  isEditing.value = true
  selectedFixture.value = fixture
  showCreateModal.value = true
}

function closeModal() {
  showCreateModal.value = false
  selectedFixture.value = null
  isEditing.value = false
}

async function handleSaveFixture(data) {
  try {
    let result
    if (isEditing.value && selectedFixture.value) {
      result = await matchStore.updateMatch(selectedFixture.value.id, data)
    } else {
      result = await matchStore.createMatch(data)
    }
    
    if (result) {
      closeModal()
      await loadFixtures()
      alert(isEditing.value ? 'Fixture updated successfully!' : 'Fixture created successfully!')
    }
  } catch (error) {
    alert(error.message || 'Failed to save fixture')
  }
}

// ── Bulk ──────────────────────────────────────────────────────────────────
function openBulkModal() { showBulkModal.value = true }
function closeBulkModal() { showBulkModal.value = false }

async function handleBulkCreated() {
  closeBulkModal()
  await loadFixtures()
  alert('Matches created successfully!')
}

// ── Odds ──────────────────────────────────────────────────────────────────
function openUpdateOdds(fixture) {
  selectedFixture.value = fixture
  showOddsModal.value = true
}

function closeOddsModal() {
  showOddsModal.value = false
  selectedFixture.value = null
}

async function handleUpdateOdds(odds) {
  if (!selectedFixture.value) return
  
  try {
    const result = await matchStore.updateOdds(selectedFixture.value.id, odds)
    if (result) {
      closeOddsModal()
      await loadFixtures()
      alert('Odds updated successfully!')
    }
  } catch (error) {
    alert(error.message || 'Failed to update odds')
  }
}

// ── Status ──────────────────────────────────────────────────────────────────
async function toggleStatus(fixture) {
  const statusMap = {
    UPCOMING: 'LIVE',
    LIVE: 'FINISHED',
    FINISHED: 'UPCOMING',
    CANCELLED: 'UPCOMING'
  }
  
  const newStatus = statusMap[fixture.status] || 'UPCOMING'
  
  if (confirm(`Change status from ${fixture.status} to ${newStatus}?`)) {
    try {
      const result = await matchStore.updateStatus(fixture.id, newStatus)
      if (result) {
        await loadFixtures()
        alert('Status updated successfully!')
      }
    } catch (error) {
      alert(error.message || 'Failed to update status')
    }
  }
}

// ── Delete ──────────────────────────────────────────────────────────────────
function openDeleteModal(fixture) {
  selectedFixture.value = fixture
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedFixture.value = null
}

async function handleDelete() {
  if (!selectedFixture.value) return

  try {
    const result = await matchStore.deleteMatch(selectedFixture.value.id)
    if (result) {
      closeDeleteModal()
      await loadFixtures()
      alert('Fixture deleted successfully!')
    }
  } catch (error) {
    alert(error.message || 'Failed to delete fixture')
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(loadFixtures)

onMounted(async () => {
  await loadFixtures()
  console.log("matches object here:", allMatches.value)
})
</script>