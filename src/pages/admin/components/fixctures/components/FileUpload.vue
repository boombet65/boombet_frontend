<template>
  <div class="border-2 border-dashed border-cyan-700 rounded-xl p-6 sm:p-8 text-center hover:border-emerald-500 transition-colors">
    <div class="mb-3 sm:mb-4">
      <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
    </div>
    <p class="text-cyan-400 text-sm sm:text-base mb-1">Drag and drop your CSV or Excel file here</p>
    <p class="text-cyan-600 text-xs sm:text-sm mb-3 sm:mb-4">or click to browse</p>
    
    <input 
      ref="fileInput"
      type="file"
      accept=".csv,.xlsx,.xls"
      class="hidden"
      @change="handleChange"
    />
    <button 
      @click="$refs.fileInput.click()"
      class="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-slate-900 rounded-xl font-bold hover:bg-emerald-400 text-sm sm:text-base"
    >
      Choose File
    </button>

    <div v-if="file" class="mt-3 sm:mt-4 p-3 sm:p-4 bg-slate-900/50 rounded-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="text-xl sm:text-2xl">📄</span>
          <div class="text-left">
            <p class="text-white font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-[300px]">{{ file.name }}</p>
            <p class="text-cyan-400 text-xs sm:text-sm">{{ (file.size / 1024).toFixed(1) }} KB</p>
          </div>
        </div>
        <button @click="$emit('remove')" class="text-red-400 hover:text-red-300 text-sm sm:text-base">✕</button>
      </div>
    </div>

    <button 
      v-if="file"
      @click="$emit('submit', file)"
      class="mt-3 sm:mt-4 w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 text-sm sm:text-base"
      :disabled="loading"
    >
      {{ loading ? 'Uploading...' : `Upload ${file.name}` }}
    </button>
  </div>

  <div class="mt-3 sm:mt-4 text-center">
    <button @click="$emit('download')" class="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm underline">
      📥 Download CSV Template
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  file: Object,
  loading: Boolean
})

const emit = defineEmits(['upload', 'remove', 'submit', 'download'])
const fileInput = ref(null)

function handleChange(e) {
  const file = e.target.files[0]
  if (file) {
    emit('upload', file)
  }
  e.target.value = ''
}
</script>