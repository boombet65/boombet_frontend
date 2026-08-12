<!-- SidebarLink.vue -->
<template>
  <!-- Tunatumia :class ya custom 'is-active' badala ya kutegemea za router -->
  <RouterLink 
    :to="to" 
    class="sidebar-link" 
    :class="{ 
      'is-active': isActive, 
      'sidebar-link--live': live 
    }"
  >
    <span class="sidebar-link__icon">{{ icon }}</span>
    <span class="sidebar-link__label">{{ label }}</span>
    <span v-if="live" class="live-dot ml-auto"></span>
    <span v-if="hot"  class="badge badge-hot ml-auto" style="font-size:9px;padding:2px 6px;">HOT</span>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  to:    { type: String, required: true },
  icon:  { type: String, default: '' },
  label: { type: String, required: true },
  live:  { type: Boolean, default: false },
  hot:   { type: Boolean, default: false },
})

const route = useRoute()

// Hapa tunalinganisha fullPath (pamoja na query string) ili zisitofautiane
const isActive = computed(() => {
  return route.fullPath === props.to
})
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all var(--transition);
  border-left: 3px solid transparent;
}
.sidebar-link:hover {
  background: var(--border);
  color: var(--text-secondary);
}

/* Badilisha kutoka .router-link-active kwenda kwenye custom class yetu */
.sidebar-link.is-active {
  background: rgba(255,193,7,0.07);
  color: var(--gold);
  border-left-color: var(--gold);
}

.sidebar-link--live { color: var(--red); }
.sidebar-link--live:hover { background: rgba(255,23,68,0.06); }
.sidebar-link__icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
.sidebar-link__label { flex: 1; }
</style>