<template>
  <div class="w-full bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-6">
    <h2 class="text-xl font-black text-cyan-100 mb-1">Create Account</h2>
    <p class="text-sm text-cyan-600 mb-6">Join BoomBet and start winning</p>

    <form class="space-y-4" @submit.prevent="handleRegister">

      <!-- Phone -->
      <div class="w-full">
        <label class="block text-xs font-semibold text-cyan-400 mb-1.5 tracking-wide">Phone Number</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cyan-500">+254</span>
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
            placeholder="Min 6 characters"
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
import { useAuthStore } from '../../stores/authStore'

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

function validate() {
  errors.value = {}

  if (!form.value.phone || form.value.phone.length < 9) {
    errors.value.phone = 'Enter a valid phone number'
  }
  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  if (!form.value.terms) {
    errors.value.terms = 'You must agree to the terms'
  }

  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  try {
    // TODO: replace with authService.register()
    await new Promise(r => setTimeout(r, 1000)) // simulate API
    authStore.setAuth(
      { phone: `+254${form.value.phone}`, balance: 0, role: 'user' },
      'dummy-token'
    )
    router.push('/dashboard')
  } catch (e) {
    errors.value.phone = 'Registration failed. Try again.'
  } finally {
    loading.value = false
  }
}
</script>