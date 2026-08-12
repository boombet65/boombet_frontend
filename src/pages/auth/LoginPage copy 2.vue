<template>
  <div class="w-full bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-6">
    <h2 class="text-xl font-black text-cyan-100 mb-1">Welcome back</h2>
    <p class="text-sm text-cyan-600 mb-6">Login to your BoomBet account</p>

    <form class="space-y-4" @submit.prevent="handleLogin">

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
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-semibold text-cyan-400 tracking-wide">Password</label>
          <span class="text-xs text-yellow-400 hover:text-yellow-300 cursor-pointer font-semibold">Forgot password?</span>
        </div>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter password"
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
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

    </form>

    <p class="text-center text-sm text-cyan-600 mt-5">
      No account?
      <RouterLink to="/register" class="text-yellow-400 hover:text-yellow-300 font-bold ml-1">Register</RouterLink>
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
  phone:    '',
  password: '',
})

function validate() {
  errors.value = {}
  if (!form.value.phone || form.value.phone.length < 9) {
    errors.value.phone = 'Enter a valid phone number'
  }
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  }
  return Object.keys(errors.value).length === 0
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  try {
    // TODO: replace with authService.login()
    await new Promise(r => setTimeout(r, 1000)) // simulate API
    authStore.setAuth(
      { phone: `+254${form.value.phone}`, balance: 5000, role: 'user' },
      'dummy-token'
    )
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    router.push(redirect || '/dashboard')
  } catch (e) {
    errors.value.general = 'Invalid phone number or password'
  } finally {
    loading.value = false
  }
}
</script>