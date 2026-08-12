<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">Fixtures Management</h1>
        <p class="text-cyan-400 text-sm">Create and manage sports fixtures for betting</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openCreateModal" 
          class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Fixture
          </span>
        </button>
        <button 
          @click="openBulkModal" 
          class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Bulk Upload
          </span>
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-slate-800/50 rounded-2xl border border-cyan-800/30 p-4">
        <p class="text-cyan-400 text-sm">Total Fixtures</p>
        <p class="text-2xl font-bold text-white">{{ totalFixtures }}</p>
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
    <div v-if="matchStore.loading" class="flex justify-center py-8">
      <div class="text-cyan-400 text-lg">Loading fixtures...</div>
    </div>

    <!-- Error State -->
    <div v-if="matchStore.error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400">
      {{ matchStore.error }}
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
          <option value="UPCOMING">🟢 Upcoming</option>
          <option value="LIVE">🔴 Live</option>
          <option value="FINISHED">⚪ Finished</option>
          <option value="CANCELLED">❌ Cancelled</option>
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
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Teams</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">League</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Date & Time</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Status</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Odds</th>
              <th class="text-left px-6 py-4 text-cyan-400 text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allMatches.length === 0 && !matchStore.loading">
              <td colspan="7" class="px-6 py-8 text-center text-cyan-400">
                No fixtures found
              </td>
            </tr>
            <tr v-for="fixture in allMatches" :key="fixture.id" class="border-t border-cyan-800/30 hover:bg-slate-900/30">
              <td class="px-6 py-4 text-white text-sm font-mono">{{ fixture.id?.slice(0, 8) }}...</td>
              <td class="px-6 py-4">
                <div class="text-white text-sm font-bold">{{ fixture.home_team }}</div>
                <div class="text-cyan-400 text-xs">vs</div>
                <div class="text-white text-sm font-bold">{{ fixture.away_team }}</div>
              </td>
              <td class="px-6 py-4 text-cyan-300 text-sm">{{ fixture.league || 'N/A' }}</td>
              <td class="px-6 py-4 text-cyan-300 text-sm">
                <div>{{ formatDate(fixture.date) }}</div>
                <div class="text-cyan-500 text-xs">{{ fixture.time }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-500/20 text-emerald-400': fixture.status === 'UPCOMING',
                    'bg-red-500/20 text-red-400': fixture.status === 'LIVE',
                    'bg-slate-500/20 text-slate-400': fixture.status === 'FINISHED',
                    'bg-red-500/20 text-red-400': fixture.status === 'CANCELLED'
                  }"
                >
                  {{ getStatusIcon(fixture.status) }} {{ fixture.status || 'UNKNOWN' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="text-emerald-400 text-sm">1: {{ fixture.odds?.['1X2']?.home || fixture.odds?.home || 'N/A' }}</div>
                  <div class="text-yellow-400 text-sm">X: {{ fixture.odds?.['1X2']?.draw || fixture.odds?.draw || 'N/A' }}</div>
                  <div class="text-red-400 text-sm">2: {{ fixture.odds?.['1X2']?.away || fixture.odds?.away || 'N/A' }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="editFixture(fixture)" class="p-1 text-yellow-400 hover:text-yellow-300" title="Edit Fixture">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="openUpdateOdds(fixture)" class="p-1 text-cyan-400 hover:text-cyan-300" title="Update Odds">
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

    <!-- ========================================================== -->
    <!-- CREATE SINGLE FIXTURE MODAL                                 -->
    <!-- ========================================================== -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeModal">
      <div class="bg-slate-800 rounded-2xl border border-cyan-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white mb-4">
          {{ isEditing ? 'Edit Fixture' : 'Create New Fixture' }}
        </h3>
        
        <form @submit.prevent="saveFixture" class="space-y-4">
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

          <!-- Odds - 1X2 format -->
          <div>
            <label class="text-cyan-400 text-sm block mb-2">Odds (1X2)</label>
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
              <option value="UPCOMING">🟢 Upcoming</option>
              <option value="LIVE">🔴 Live</option>
              <option value="FINISHED">⚪ Finished</option>
              <option value="CANCELLED">❌ Cancelled</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button 
              type="submit" 
              class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500"
              :disabled="matchStore.actionLoading"
            >
              {{ matchStore.actionLoading ? 'Saving...' : 'Save Fixture' }}
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

    <!-- ========================================================== -->
    <!-- BULK UPLOAD MODAL                                           -->
    <!-- ========================================================== -->
    <div v-if="showBulkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeBulkModal">
      <div class="bg-slate-800 rounded-2xl border border-emerald-700 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white mb-4">Bulk Upload Fixtures</h3>
        <p class="text-cyan-400 text-sm mb-6">Add multiple fixtures at once using form or CSV/Excel file</p>

        <!-- Tab Selection -->
        <div class="flex gap-2 mb-6 bg-slate-900 rounded-xl p-1">
          <button 
            @click="bulkTab = 'form'"
            class="flex-1 py-2 px-4 rounded-lg font-medium transition-all"
            :class="bulkTab === 'form' ? 'bg-emerald-500 text-slate-900' : 'text-cyan-400 hover:text-white'"
          >
            📝 Form Input
          </button>
          <button 
            @click="bulkTab = 'file'"
            class="flex-1 py-2 px-4 rounded-lg font-medium transition-all"
            :class="bulkTab === 'file' ? 'bg-emerald-500 text-slate-900' : 'text-cyan-400 hover:text-white'"
          >
            📁 Upload File (CSV/Excel)
          </button>
        </div>

        <!-- TAB 1: FORM INPUT -->
        <div v-if="bulkTab === 'form'">
          <div class="mb-4">
            <label class="text-cyan-400 text-sm block mb-2">Number of matches to add</label>
            <div class="flex gap-3">
              <input 
                v-model.number="bulkForm.numberOfMatches"
                type="number"
                min="1"
                max="20"
                class="w-32 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100"
              />
              <button 
                @click="generateBulkForm"
                class="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-bold hover:bg-emerald-400"
              >
                Generate Form
              </button>
            </div>
          </div>

          <div v-if="bulkForm.matches.length > 0" class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div 
              v-for="(match, index) in bulkForm.matches" 
              :key="index"
              class="bg-slate-900/50 rounded-xl border border-cyan-800/30 p-4"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-cyan-400 text-sm font-bold">Match #{{ index + 1 }}</span>
                <button 
                  @click="removeBulkMatch(index)"
                  class="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕ Remove
                </button>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">Home Team</label>
                  <input 
                    v-model="match.home_team"
                    type="text"
                    placeholder="Home Team"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
                  />
                </div>
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">Away Team</label>
                  <input 
                    v-model="match.away_team"
                    type="text"
                    placeholder="Away Team"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
                  />
                </div>
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">League</label>
                  <input 
                    v-model="match.league"
                    type="text"
                    placeholder="e.g. Premier League"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm placeholder-cyan-700"
                  />
                </div>
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">Date</label>
                  <input 
                    v-model="match.date"
                    type="date"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  />
                </div>
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">Time</label>
                  <input 
                    v-model="match.time"
                    type="time"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  />
                </div>
                <div>
                  <label class="text-emerald-400 text-xs block mb-1">Odds Home</label>
                  <input 
                    v-model.number="match.odds_home"
                    type="number"
                    step="0.01"
                    placeholder="1.95"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  />
                </div>
                <div>
                  <label class="text-yellow-400 text-xs block mb-1">Odds Draw</label>
                  <input 
                    v-model.number="match.odds_draw"
                    type="number"
                    step="0.01"
                    placeholder="3.20"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  />
                </div>
                <div>
                  <label class="text-red-400 text-xs block mb-1">Odds Away</label>
                  <input 
                    v-model.number="match.odds_away"
                    type="number"
                    step="0.01"
                    placeholder="4.50"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  />
                </div>
                <div>
                  <label class="text-cyan-400 text-xs block mb-1">Status</label>
                  <select 
                    v-model="match.status"
                    class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-sm"
                  >
                    <option value="UPCOMING">🟢 Upcoming</option>
                    <option value="LIVE">🔴 Live</option>
                    <option value="FINISHED">⚪ Finished</option>
                    <option value="CANCELLED">❌ Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-if="bulkForm.matches.length > 0" class="flex gap-3 pt-4">
            <button 
              @click="submitBulkMatches"
              class="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500"
              :disabled="matchStore.actionLoading"
            >
              {{ matchStore.actionLoading ? 'Saving...' : `Save ${bulkForm.matches.length} Matches` }}
            </button>
            <button 
              @click="clearBulkForm"
              class="px-4 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600"
            >
              Clear All
            </button>
          </div>
        </div>

        <!-- TAB 2: FILE UPLOAD -->
        <div v-if="bulkTab === 'file'">
          <div class="border-2 border-dashed border-cyan-700 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
            <div class="mb-4">
              <svg class="w-16 h-16 mx-auto text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <p class="text-cyan-400 mb-2">Drag and drop your CSV or Excel file here</p>
            <p class="text-cyan-600 text-sm mb-4">or click to browse</p>
            
            <input 
              ref="fileInput"
              type="file"
              accept=".csv,.xlsx,.xls"
              class="hidden"
              @change="handleFileUpload"
            />
            <button 
              @click="$refs.fileInput.click()"
              class="px-6 py-3 bg-emerald-500 text-slate-900 rounded-xl font-bold hover:bg-emerald-400"
            >
              Choose File
            </button>

            <div v-if="uploadedFile" class="mt-4 p-4 bg-slate-900/50 rounded-xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">📄</span>
                  <div class="text-left">
                    <p class="text-white font-medium">{{ uploadedFile.name }}</p>
                    <p class="text-cyan-400 text-sm">{{ (uploadedFile.size / 1024).toFixed(1) }} KB</p>
                  </div>
                </div>
                <button 
                  @click="removeUploadedFile"
                  class="text-red-400 hover:text-red-300"
                >
                  ✕ Remove
                </button>
              </div>
            </div>

            <button 
              v-if="uploadedFile"
              @click="submitFileUpload"
              class="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500"
              :disabled="matchStore.actionLoading"
            >
              {{ matchStore.actionLoading ? 'Uploading...' : `Upload ${uploadedFile.name}` }}
            </button>
          </div>

          <div class="mt-4 text-center">
            <button 
              @click="downloadCSVTemplate"
              class="text-cyan-400 hover:text-cyan-300 text-sm underline"
            >
              📥 Download CSV Template
            </button>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-cyan-800/30 mt-6">
          <button 
            @click="closeBulkModal" 
            class="flex-1 py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600"
          >
            Close
          </button>
        </div>
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
import { useMatchStore } from '../../../../stores/match/useMatchStore'

// ── Store ──────────────────────────────────────────────────────────────────
const matchStore = useMatchStore()

// ── Computed ──────────────────────────────────────────────────────────────
const allMatches = computed(() => {
  return [...matchStore.upcomingMatches, ...matchStore.liveMatches]
})

const totalFixtures = computed(() => {
  return matchStore.upcomingMatches.length + matchStore.liveMatches.length
})

const upcomingCount = computed(() => {
  return matchStore.upcomingMatches.length
})

const liveCount = computed(() => {
  return matchStore.liveMatches.length
})

const finishedCount = computed(() => {
  return matchStore.upcomingMatches.filter(f => f.status === 'FINISHED').length
})

const totalBetsOnFixtures = computed(() => {
  return allMatches.value.reduce((sum, f) => sum + (f.totalBets || 0), 0)
})

// ── Local State ────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filterSport = ref('')
const filterStatus = ref('')
const searchTimeout = ref(null)

// Modals
const showCreateModal = ref(false)
const showBulkModal = ref(false)
const showOddsModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedFixture = ref(null)
const bulkTab = ref('form')
const uploadedFile = ref(null)
const fileInput = ref(null)

// Single Match Form
const fixtureForm = ref({
  home_team: '',
  away_team: '',
  league: '',
  date: '',
  time: '',
  odds_home: null,
  odds_draw: null,
  odds_away: null,
  status: 'UPCOMING'
})

// Bulk Form
const bulkForm = ref({
  numberOfMatches: 5,
  matches: []
})

// Odds Form
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
  return d
}

function getStatusIcon(status) {
  const icons = {
    UPCOMING: '🟢',
    LIVE: '🔴',
    FINISHED: '⚪',
    CANCELLED: '❌'
  }
  return icons[status] || '⚪'
}

// ── Load Fixtures ──────────────────────────────────────────────────────────
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

// ── Single Match CRUD ──────────────────────────────────────────────────────
function openCreateModal() {
  isEditing.value = false
  resetForm()
  showCreateModal.value = true
}

function editFixture(fixture) {
  isEditing.value = true
  selectedFixture.value = fixture
  
  fixtureForm.value = {
    home_team: fixture.home_team,
    away_team: fixture.away_team,
    league: fixture.league || '',
    date: fixture.date,
    time: fixture.time,
    odds_home: fixture.odds?.['1X2']?.home || fixture.odds?.home || null,
    odds_draw: fixture.odds?.['1X2']?.draw || fixture.odds?.draw || null,
    odds_away: fixture.odds?.['1X2']?.away || fixture.odds?.away || null,
    status: fixture.status || 'UPCOMING'
  }
  showCreateModal.value = true
}

function resetForm() {
  fixtureForm.value = {
    home_team: '',
    away_team: '',
    league: '',
    date: '',
    time: '',
    odds_home: null,
    odds_draw: null,
    odds_away: null,
    status: 'UPCOMING'
  }
}

async function saveFixture() {
  const form = fixtureForm.value
  
  const fixtureData = {
    home_team: form.home_team,
    away_team: form.away_team,
    league: form.league || null,
    date: form.date,
    time: form.time,
    odds: {
      '1X2': {
        home: form.odds_home || null,
        draw: form.odds_draw || null,
        away: form.odds_away || null
      }
    },
    status: form.status
  }

  try {
    let result
    if (isEditing.value && selectedFixture.value) {
      // Update match - we need a separate endpoint for full update
      result = await matchStore.updateMatch(selectedFixture.value.id, fixtureData)
    } else {
      result = await matchStore.createMatch(fixtureData)
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

function closeModal() {
  showCreateModal.value = false
  selectedFixture.value = null
  isEditing.value = false
  resetForm()
}

// ── Bulk Match Functions ───────────────────────────────────────────────────
function openBulkModal() {
  bulkTab.value = 'form'
  uploadedFile.value = null
  bulkForm.value = {
    numberOfMatches: 5,
    matches: []
  }
  showBulkModal.value = true
}

function closeBulkModal() {
  showBulkModal.value = false
  bulkForm.value = { numberOfMatches: 5, matches: [] }
  uploadedFile.value = null
}

function generateBulkForm() {
  const count = Math.min(bulkForm.value.numberOfMatches || 1, 20)
  const currentLength = bulkForm.value.matches.length
  
  if (count > currentLength) {
    for (let i = currentLength; i < count; i++) {
      bulkForm.value.matches.push({
        home_team: '',
        away_team: '',
        league: '',
        date: '',
        time: '',
        odds_home: null,
        odds_draw: null,
        odds_away: null,
        status: 'UPCOMING'
      })
    }
  } else if (count < currentLength) {
    bulkForm.value.matches = bulkForm.value.matches.slice(0, count)
  }
}

function removeBulkMatch(index) {
  bulkForm.value.matches.splice(index, 1)
}

function clearBulkForm() {
  bulkForm.value.matches = []
  bulkForm.value.numberOfMatches = 5
}

async function submitBulkMatches() {
  const invalid = bulkForm.value.matches.some(m => 
    !m.home_team || !m.away_team || !m.date || !m.time
  )
  
  if (invalid) {
    alert('Please fill in all required fields (Home Team, Away Team, Date, Time) for each match')
    return
  }

  const matches = bulkForm.value.matches.map(m => ({
    home_team: m.home_team,
    away_team: m.away_team,
    league: m.league || null,
    date: m.date,
    time: m.time,
    odds: {
      '1X2': {
        home: m.odds_home || null,
        draw: m.odds_draw || null,
        away: m.odds_away || null
      }
    },
    status: m.status || 'UPCOMING'
  }))

  try {
    const result = await matchStore.createMultipleMatches(matches)
    
    if (result) {
      closeBulkModal()
      await loadFixtures()
      alert(`${matches.length} matches created successfully!`)
    }
  } catch (error) {
    alert(error.message || 'Failed to create matches')
  }
}

// ── File Upload Functions ─────────────────────────────────────────────────
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    uploadedFile.value = file
  }
  event.target.value = ''
}

function removeUploadedFile() {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function submitFileUpload() {
  if (!uploadedFile.value) {
    alert('Please select a file first')
    return
  }

  try {
    const result = await matchStore.uploadMatchesFile(uploadedFile.value)
    
    if (result) {
      closeBulkModal()
      await loadFixtures()
      alert('File uploaded and matches created successfully!')
    }
  } catch (error) {
    alert(error.message || 'Failed to upload file')
  }
}

function downloadCSVTemplate() {
  const headers = ['home_team','away_team','league','date','time','odds_home','odds_draw','odds_away','status']
  const sampleRow = ['Manchester United','Liverpool','Premier League','2024-12-25','15:00','1.95','3.20','4.50','UPCOMING']
  
  const csvContent = [
    headers.join(','),
    sampleRow.join(',')
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'fixtures_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// ── Update Odds ────────────────────────────────────────────────────────────
function openUpdateOdds(fixture) {
  selectedFixture.value = fixture
  oddsForm.value = {
    home: fixture.odds?.['1X2']?.home || fixture.odds?.home || null,
    draw: fixture.odds?.['1X2']?.draw || fixture.odds?.draw || null,
    away: fixture.odds?.['1X2']?.away || fixture.odds?.away || null
  }
  showOddsModal.value = true
}

async function confirmUpdateOdds() {
  if (!selectedFixture.value) return

  try {
    const result = await matchStore.updateOdds(
      selectedFixture.value.id,
      oddsForm.value
    )

    if (result) {
      closeOddsModal()
      await loadFixtures()
      alert('Odds updated successfully!')
    }
  } catch (error) {
    alert(error.message || 'Failed to update odds')
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

async function confirmDelete() {
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

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedFixture.value = null
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  loadFixtures()
})
</script>