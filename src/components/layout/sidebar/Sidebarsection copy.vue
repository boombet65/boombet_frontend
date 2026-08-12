// sidebarSection.vue 

<template>
    <div class="sidebar-section">
      <p class="sidebar-section__label">{{ label }}</p>
      <slot />
    </div>
  </template>
  

  <script setup>
  defineProps({ label: String })
  </script>
  

  <style scoped>
  .sidebar-section { margin-bottom: 4px; }
  .sidebar-section__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
    padding: 8px 10px 4px;
  }
  </style>