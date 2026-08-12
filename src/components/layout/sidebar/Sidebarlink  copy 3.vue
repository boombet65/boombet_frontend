<template>
  <component 
    :is="disabled ? 'div' : RouterLink"
    :to="disabled ? undefined : to" 
    class="sidebar-link" 
    :class="{ 
      'sidebar-link--live': live,
      'sidebar-link--disabled': disabled,
      'sidebar-link--active': !disabled && isActive
    }"
    @click="handleClick"
  >
    <span class="sidebar-link__icon">{{ icon }}</span>
    <span class="sidebar-link__label">{{ label }}</span>
    <span v-if="live" class="live-dot ml-auto"></span>
    <span v-if="hot" class="badge badge-hot ml-auto">HOT</span>
  </component>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, default: '' },
  label: { type: String, required: true },
  live: { type: Boolean, default: false },
  hot: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
const route = useRoute()

// Check if this link is currently active
const isActive = computed(() => {
  if (props.disabled) return false
  // Check exact match or if route starts with the link path
  return route.path === props.to || 
         route.fullPath === props.to ||
         (props.to !== '/' && route.path.startsWith(props.to))
})

const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    emit('click', event)
  } else {
    emit('click', event)
  }
}
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
  cursor: pointer;
  user-select: none;
}

/* Active link styles */
.sidebar-link--active {
  background: rgba(255, 193, 7, 0.07);
  color: var(--gold);
  border-left-color: var(--gold);
}

/* Hover for active links */
.sidebar-link:not(.sidebar-link--disabled):not(.sidebar-link--active):hover {
  background: var(--border);
  color: var(--text-secondary);
}

.sidebar-link--live { 
  color: var(--red); 
}

.sidebar-link--live:hover { 
  background: rgba(255, 23, 68, 0.06); 
}

.sidebar-link__icon { 
  font-size: 15px; 
  width: 20px; 
  text-align: center; 
  flex-shrink: 0; 
}

.sidebar-link__label { 
  flex: 1; 
}

.badge-hot {
  font-size: 9px;
  padding: 2px 6px;
  background: #ff2344;
  color: #fff;
  border-radius: 4px;
  font-weight: 700;
}

/* Disabled styles */
.sidebar-link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sidebar-link--disabled:hover {
  background: transparent !important;
  color: var(--text-muted) !important;
}

.ml-auto {
  margin-left: auto;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #ff2344;
  border-radius: 50%;
  display: inline-block;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>