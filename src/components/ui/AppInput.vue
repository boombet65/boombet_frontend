
<template>
    <div class="w-full">
      <label v-if="label" class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">
        {{ label }}
      </label>
      <div class="relative">
        <span v-if="$slots.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600">
          <slot name="prefix" />
        </span>
        <input
          v-bind="$attrs"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl text-sm font-medium outline-none transition-all duration-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="[$slots.prefix ? 'pl-9' : 'pl-4', $slots.suffix ? 'pr-9' : 'pr-4', 'py-3']"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <span v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600">
          <slot name="suffix" />
        </span>
      </div>
      <p v-if="error" class="mt-1.5 text-xs text-red-400">{{ error }}</p>
      <p v-if="hint && !error" class="mt-1.5 text-xs text-cyan-600">{{ hint }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue:  { type: [String, Number], default: '' },
    label:       { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type:        { type: String, default: 'text' },
    error:       { type: String, default: '' },
    hint:        { type: String, default: '' },
    disabled:    { type: Boolean, default: false },
  })
  defineEmits(['update:modelValue'])
  </script>