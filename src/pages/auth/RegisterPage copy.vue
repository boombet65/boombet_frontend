<template>
    <div class="w-full bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-6">
      <h2 class="text-xl font-black text-cyan-100 mb-1">Create account</h2>
      <p class="text-sm text-cyan-600 mb-6">Join BoomBet and start winning</p>
  
      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="grid grid-cols-2 gap-3">
          <AppInput v-model="form.firstName" label="First Name" placeholder="John" :error="errors.firstName" />
          <AppInput v-model="form.lastName"  label="Last Name"  placeholder="Doe"  :error="errors.lastName" />
        </div>
        <AppInput v-model="form.phone"    label="Phone"    type="tel"      placeholder="+254 7XX XXX XXX" :error="errors.phone" />
        <AppInput v-model="form.email"    label="Email"    type="email"    placeholder="you@example.com"  :error="errors.email" />
        <AppInput v-model="form.password" label="Password" type="password" placeholder="Min 8 characters" :error="errors.password" />
  
        <label class="flex items-start gap-2 text-xs text-cyan-500 cursor-pointer">
          <input v-model="form.terms" type="checkbox" class="mt-0.5 rounded border-cyan-700 bg-cyan-950 accent-yellow-400" />
          <span>I confirm I am 18+ and agree to the <span class="text-yellow-400">Terms & Conditions</span></span>
        </label>
  
        <AppButton type="submit" variant="primary" :block="true" :loading="loading" size="lg">
          Create Account
        </AppButton>
      </form>
  
      <p class="text-center text-sm text-cyan-600 mt-5">
        Have an account?
        <RouterLink to="/login" class="text-yellow-400 hover:text-yellow-300 font-bold ml-1">Login</RouterLink>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useAuth } from '../../composables/useAuth'
  import AppInput  from '../../components/ui/AppInput.vue'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const { register } = useAuth()
  const loading = ref(false)
  const form    = ref({ firstName: '', lastName: '', phone: '', email: '', password: '', terms: false })
  const errors  = ref({})
  
  async function handleRegister() {
    errors.value = {}
    if (!form.value.firstName) { errors.value.firstName = 'Required'; return }
    if (!form.value.email)     { errors.value.email     = 'Required'; return }
    if (!form.value.password || form.value.password.length < 8) { errors.value.password = 'Min 8 characters'; return }
    if (!form.value.terms)     { errors.value.terms = 'Required'; return }
    loading.value = true
    try { await register(form.value) }
    catch (e) { errors.value.email = 'Registration failed' }
    finally   { loading.value = false }
  }
  </script>