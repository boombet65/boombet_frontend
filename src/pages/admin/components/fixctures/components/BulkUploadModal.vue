<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-2xl border border-emerald-700 p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg sm:text-xl font-bold text-white mb-2">Bulk Upload Fixtures</h3>
      <p class="text-cyan-400 text-xs sm:text-sm mb-4 sm:mb-6">Add multiple fixtures at once using form or CSV/Excel file</p>

      <!-- Tabs -->
      <div class="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-slate-900 rounded-xl p-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium transition-all text-xs sm:text-sm"
          :class="activeTab === tab.key ? 'bg-emerald-500 text-slate-900' : 'text-cyan-400 hover:text-white'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Form Tab -->
      <div v-if="activeTab === 'form'">
        <BulkForm 
          :matches="matches"
          @add="addMatches"
          @remove="removeMatch"
          @clear="clearMatches"
          @submit="submitMatches"
          :loading="loading"
        />
      </div>

      <!-- File Tab -->
      <div v-else>
        <FileUpload 
          :file="uploadedFile"
          :loading="loading"
          @upload="handleFileUpload"
          @remove="removeUploadedFile"
          @submit="submitFileUpload"
          @download="downloadTemplate"
        />
      </div>

      <!-- Close -->
      <div class="flex gap-2 sm:gap-3 pt-4 border-t border-cyan-800/30 mt-4 sm:mt-6">
        <button 
          @click="$emit('close')" 
          class="flex-1 py-2.5 sm:py-3 bg-slate-700 text-cyan-400 rounded-xl font-bold hover:bg-slate-600 text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BulkForm from './BulkForm.vue'
import FileUpload from './FileUpload.vue'

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'created', 'close'])

const tabs = [
  { key: 'form', icon: '📝', label: 'Form' },
  { key: 'file', icon: '📁', label: 'File' }
]

const activeTab = ref('form')
const matches = ref([])
const uploadedFile = ref(null)

function addMatches(count) {
  const current = matches.value.length
  for (let i = current; i < count; i++) {
    matches.value.push({
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
}

function removeMatch(index) {
  matches.value.splice(index, 1)
}

function clearMatches() {
  matches.value = []
}

function submitMatches(data) {
  emit('created', data)
}

function handleFileUpload(file) {
  uploadedFile.value = file
}

function removeUploadedFile() {
  uploadedFile.value = null
}

function submitFileUpload(file) {
  emit('created', { file })
}

function downloadTemplate() {
  emit('created', { download: true })
}
</script>