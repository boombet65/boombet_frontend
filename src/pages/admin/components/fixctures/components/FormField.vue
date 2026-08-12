<template>
  <div>
    <label class="text-cyan-400 text-[10px] sm:text-xs block mb-0.5" :class="colorClass">{{ label }}</label>
    <input 
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :step="step"
      @input="handleInput"
      class="w-full px-2 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-800 text-cyan-100 text-xs sm:text-sm placeholder-cyan-700"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  step: String,
  color: { type: String, default: 'cyan' }
})

const emit = defineEmits(['update:modelValue'])

const colorClass = {
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
  yellow: 'text-yellow-400',
  red: 'text-red-400'
}[props.color] || 'text-cyan-400'

function handleInput(e) {
  const val = props.type === 'number' ? Number(e.target.value) : e.target.value
  emit('update:modelValue', val)
}
</script>