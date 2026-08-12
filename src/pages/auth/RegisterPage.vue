// pages/auth/RegisterPage.vue
<template>
  <div class="w-full bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-6">
    <h2 class="text-xl font-black text-cyan-100 mb-1">Create Account</h2>
    <p class="text-sm text-cyan-600 mb-6">Join BoomBet and start winning</p>

    <form class="space-y-4" @submit.prevent="handleRegister">

      <!-- Phone -->
      <div class="w-full">
        <label class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">Phone Number</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cyan-500">+255</span>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="7XX XXX XXX"
            maxlength="9"
            class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-14 pr-4 py-3 text-sm font-medium outline-none transition-all duration-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            :class="errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
          />
        </div>
        <p v-if="errors.phone" class="mt-1.5 text-xs text-red-400">{{ errors.phone }}</p>
      </div>

      <!-- Password -->
      <div class="w-full">
        <label class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">Password</label>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Min 4 characters"
            class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl pl-4 pr-11 py-3 text-sm font-medium outline-none transition-all duration-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            :class="errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
          />
          <button type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-300 transition-colors"
                  @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="mt-1.5 text-xs text-red-400">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="w-full">
        <label class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">Confirm Password</label>
        <input
          v-model="form.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Repeat password"
          class="w-full bg-cyan-950/60 border border-cyan-800 text-cyan-100 placeholder-cyan-700 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
          :class="errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''"
        />
        <p v-if="errors.confirmPassword" class="mt-1.5 text-xs text-red-400">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Terms -->
      <label class="flex items-start gap-3 cursor-pointer">
        <input v-model="form.terms" type="checkbox"
               class="mt-0.5 w-4 h-4 rounded border-cyan-700 bg-cyan-950 accent-yellow-400 flex-shrink-0" />
        <span class="text-xs text-cyan-500 leading-relaxed">
          I confirm I am 18+ and agree to the
          <span class="text-yellow-400 cursor-pointer hover:underline">Terms & Conditions</span>
        </span>
      </label>
      <p v-if="errors.terms" class="text-xs text-red-400 -mt-2">{{ errors.terms }}</p>

      <!-- General error -->
      <div v-if="errors.general"
           class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errors.general }}
      </div>

      <!-- Submit -->
      <button type="submit"
              class="w-full py-3.5 rounded-xl font-black text-base bg-gradient-to-r from-yellow-500 to-yellow-400 text-cyan-950 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              :disabled="loading">
        <span v-if="loading" class="w-4 h-4 border-2 border-cyan-950 border-t-transparent rounded-full animate-spin" />
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>

    </form>

    <p class="text-center text-sm text-cyan-600 mt-5">
      Already have an account?
      <RouterLink to="/login" class="text-yellow-400 hover:text-yellow-300 font-bold ml-1">Login</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore'

const router    = useRouter()
const authStore = useAuthStore()

const loading      = ref(false)
const showPassword = ref(false)
const errors       = ref({})

const form = ref({
  phone:           '',
  password:        '',
  confirmPassword: '',
  terms:           false,
})

// Format phone number to send to backend (Tanzania format +255...)
function formatPhoneForBackend(phone) {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  // If starts with 0, replace with 255
  if (cleaned.startsWith('0')) {
    cleaned = '255' + cleaned.substring(1)
  }
  // If doesn't start with 255, add it
  if (!cleaned.startsWith('255')) {
    cleaned = '255' + cleaned
  }
  return cleaned
}

function validate() {
  errors.value = {}

  // Phone validation
  if (!form.value.phone || form.value.phone.length < 9) {
    errors.value.phone = 'Enter a valid phone number (7XX XXX XXX)'
  } else if (!/^\d{9}$/.test(form.value.phone)) {
    errors.value.phone = 'Phone number must contain only digits'
  }

  // Password validation (minimum 4 characters as per backend)
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 4) {
    errors.value.password = 'Password must be at least 4 characters'
  }

  // Confirm password validation
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  // Terms validation
  if (!form.value.terms) {
    errors.value.terms = 'You must agree to the terms'
  }

  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return
  
  loading.value = true
  errors.value.general = null
  
  try {
    // Format phone number for backend
    const phoneNumber = formatPhoneForBackend(form.value.phone)
    
    // Call authStore register (it will automatically login after registration)
    const result = await authStore.register(phoneNumber, form.value.password)
    
    if (result.success) {
      // Registration and login successful - redirect to dashboard
      router.push('/')
    } else {
      // Registration failed
      if (result.message.includes('already exists')) {
        errors.value.phone = 'Phone number already registered. Please login instead.'
      } else {
        errors.value.general = result.message || 'Registration failed. Please try again.'
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    errors.value.general = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>