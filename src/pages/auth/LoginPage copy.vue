<template>
    <div class="w-full bg-cyan-900/20 border border-cyan-800/40 rounded-2xl p-6">
      <h2 class="text-xl font-black text-cyan-100 mb-1">Welcome back</h2>
      <p class="text-sm text-cyan-600 mb-6">Login to your BoomBet account</p>
  
      <form class="space-y-4" @submit.prevent="handleLogin">
        <AppInput v-model="form.email"    label="Email"    type="email"    placeholder="you@example.com" :error="errors.email" />
        <AppInput v-model="form.password" label="Password" type="password" placeholder="••••••••"        :error="errors.password" />
  
        <div class="flex items-center justify-between text-xs">
          <label class="flex items-center gap-2 text-cyan-500 cursor-pointer">
            <input type="checkbox" class="rounded border-cyan-700 bg-cyan-950 accent-yellow-400" />
            Remember me
          </label>
          <RouterLink to="/forgot-password" class="text-yellow-400 hover:text-yellow-300 font-semibold">Forgot password?</RouterLink>
        </div>
  
        <AppButton type="submit" variant="primary" :block="true" :loading="loading" size="lg">
          Login
        </AppButton>
      </form>
  
      <p class="text-center text-sm text-cyan-600 mt-5">
        No account?
        <RouterLink to="/register" class="text-yellow-400 hover:text-yellow-300 font-bold ml-1">Register</RouterLink>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useAuth } from '../../composables/useAuth'
  import AppInput  from '../../components/ui/AppInput.vue'
  import AppButton from '../../components/ui/AppButton.vue'
  
  const { login } = useAuth()
  const loading = ref(false)
  const form    = ref({ email: '', password: '' })
  const errors  = ref({})
  
  async function handleLogin() {
    errors.value = {}
    if (!form.value.email)    { errors.value.email    = 'Email is required'; return }
    if (!form.value.password) { errors.value.password = 'Password is required'; return }
    loading.value = true
    try { await login(form.value) }
    catch (e) { errors.value.email = 'Invalid credentials' }
    finally   { loading.value = false }
  }
  </script>