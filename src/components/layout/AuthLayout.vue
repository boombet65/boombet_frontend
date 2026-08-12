<template>
    <div class="auth-layout">
      <!-- Background glow blobs -->
      <div class="auth-blob auth-blob--gold"></div>
      <div class="auth-blob auth-blob--purple"></div>
  
      <!-- Card container -->
      <div class="auth-container">
  
        <!-- Logo -->
        <RouterLink to="/" class="auth-logo">
          <div class="auth-logo__icon">B</div>
          <span class="auth-logo__text">BOOMBET</span>
        </RouterLink>
  
        <!-- Page slot -->
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
  
        <!-- Footer -->
        <p class="auth-footer">18+ only · Play Responsibly</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { RouterView, RouterLink } from 'vue-router'
  </script>
  
  <style scoped>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--grad-hero);
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }
  
  .auth-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .auth-blob--gold {
    width: 400px; height: 400px;
    background: rgba(255,193,7,0.08);
    top: -100px; right: -100px;
  }
  .auth-blob--purple {
    width: 350px; height: 350px;
    background: rgba(213,0,249,0.06);
    bottom: -80px; left: -80px;
  }
  
  .auth-container {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .auth-logo__icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--grad-gold);
    color: #080b12;
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .auth-logo__text {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    background: var(--grad-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
  }
  
  .auth-footer {
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
  }
  </style>