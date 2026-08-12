// src/composables/useAuth.js
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const isAdmin = computed(() => authStore.user?.role === 'ADMIN')
  const isAgent = computed(() => authStore.user?.role === 'AGENT')
  const user = computed(() => authStore.user)
  const balance = computed(() => authStore.user?.balance ?? 0.00)

  async function login(phone, password) {
    const result = await authStore.login(phone, password)
    if (result.success) {
      router.push('/dashboard')
    }
    return result
  }

  async function register(phone, password) {
    const result = await authStore.register(phone, password)
    if (result.success) {
      router.push('/')
    }
    return result
  }

  function logout() {
    authStore.logout()
    router.push('/auth/login')
  }

  return { 
    isLoggedIn, 
    isAdmin, 
    isAgent,
    user, 
    balance,
    login, 
    register, 
    logout 
  }
}