// App.vue 
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'

import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth/authStore'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()  // ← HII NI MUHIMU!
})
</script>