<!-- AviatorCanvas.vue  -->
<template>
    <div class="aviator-canvas" ref="canvasWrap">
      <canvas ref="canvas" class="aviator-canvas__cvs" />
  
      <div class="aviator-canvas__hud">
        <template v-if="aviatorStore.isWaiting">
          <p class="hud-label">NEXT ROUND IN</p>
          <p class="hud-countdown">{{ countdown }}s</p>
        </template>
        <template v-else-if="aviatorStore.isCrashed">
          <p class="hud-label">FLEW AWAY</p>
          <p class="hud-multiplier crashed">{{ aviatorStore.multiplier.toFixed(2) }}x</p>
        </template>
        <template v-else>
          <p class="hud-multiplier" :class="multiplierClass">
            {{ aviatorStore.multiplier.toFixed(2) }}x
          </p>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useAviator } from '../../../composables/useAviator'
  
  const { aviatorStore } = useAviator()
  
  const canvas     = ref(null)
  const canvasWrap = ref(null)
  const countdown  = ref(5)
  
  let ctx, animFrame, countdownTimer
  let planeX = 0, planeY = 0
  let points = []
  let t      = 0
  
  // ── Canvas resize ────────────────────────────────────────────────────────
  function resize() {
    if (!canvas.value || !canvasWrap.value) return
    canvas.value.width  = canvasWrap.value.clientWidth
    canvas.value.height = canvasWrap.value.clientHeight
  }
  
  // ── Background ───────────────────────────────────────────────────────────
  function drawBackground() {
    const w = canvas.value.width
    const h = canvas.value.height
  
    ctx.fillStyle = '#06020f'
    ctx.fillRect(0, 0, w, h)
  
    // purple rays from bottom-left
    const cx = w * 0.15, cy = h * 0.92
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI - Math.PI * 0.1
      const x2 = cx + Math.cos(angle) * w * 2.2
      const y2 = cy + Math.sin(angle) * -h * 2.2
      const grad = ctx.createLinearGradient(cx, cy, x2, y2)
      grad.addColorStop(0,   'rgba(180,30,255,0.07)')
      grad.addColorStop(0.4, 'rgba(120,0,200,0.03)')
      grad.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = grad
      ctx.lineWidth = w / 24 * 1.4
      ctx.stroke()
    }
  
    // grid
    ctx.strokeStyle = 'rgba(140,60,255,0.08)'
    ctx.lineWidth = 1
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  
    // ground glow
    const gg = ctx.createLinearGradient(0, h * 0.8, 0, h)
    gg.addColorStop(0, 'rgba(180,30,255,0)')
    gg.addColorStop(1, 'rgba(180,30,255,0.06)')
    ctx.fillStyle = gg
    ctx.fillRect(0, h * 0.8, w, h * 0.2)
  
    // baseline
    ctx.strokeStyle = 'rgba(180,30,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, h - 2); ctx.lineTo(w, h - 2); ctx.stroke()
  }
  
  // ── Curve math ───────────────────────────────────────────────────────────
  function getPoint(progress, w, h) {
    const margin = 48
    return {
      x: margin + progress * (w - margin * 2) * 0.75,
      y: (h - margin) - Math.pow(progress, 1.6) * (h - margin * 2) * 0.88
    }
  }
  
  // ── Trajectory line ──────────────────────────────────────────────────────
  function drawTrajectory(w, h) {
    if (points.length < 2) return
  
    ctx.save()
    ctx.shadowBlur  = 18
    ctx.shadowColor = '#ff1744'
  
    const grad = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length-1].x, points[points.length-1].y)
    grad.addColorStop(0,   'rgba(255,23,68,0.15)')
    grad.addColorStop(0.7, 'rgba(255,23,68,0.8)')
    grad.addColorStop(1,   '#ff1744')
  
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.strokeStyle = grad
    ctx.lineWidth   = 2.5
    ctx.lineJoin    = 'round'
    ctx.lineCap     = 'round'
    ctx.stroke()
    ctx.restore()
  
    // fill under curve
    ctx.save()
    const fg = ctx.createLinearGradient(0, h - 48, 0, h - 48 - h * 0.7)
    fg.addColorStop(0, 'rgba(255,23,68,0.18)')
    fg.addColorStop(1, 'rgba(255,23,68,0)')
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.lineTo(points[points.length-1].x, h - 48)
    ctx.lineTo(points[0].x, h - 48)
    ctx.closePath()
    ctx.fillStyle = fg
    ctx.fill()
    ctx.restore()
  }
  
  // ── Plane ────────────────────────────────────────────────────────────────
  function drawPlane(x, y, crashed) {
    ctx.save()
    ctx.translate(x, y)
  
    let angle = -0.45
    if (t > 0.5) angle = -0.2
    if (t > 0.8) angle = -0.05
    if (crashed)  angle = 0.6
    ctx.rotate(angle)
    ctx.scale(1.1, 1.1)
  
    if (!crashed) { ctx.shadowBlur = 28; ctx.shadowColor = '#ff1744' }
    ctx.fillStyle = crashed ? '#666' : '#ffffff'
  
    // Body
    ctx.beginPath(); ctx.ellipse(0, 0, 30, 9, 0, 0, Math.PI * 2); ctx.fill()
    // Nose
    ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(44, 2); ctx.lineTo(28, 6); ctx.closePath(); ctx.fill()
    // Main wing
    ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(-8, -22); ctx.lineTo(-22, -22); ctx.lineTo(-18, -2); ctx.closePath(); ctx.fill()
    // Lower wing
    ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(-8, 16); ctx.lineTo(-18, 16); ctx.lineTo(-14, 2); ctx.closePath(); ctx.fill()
    // Tail
    ctx.beginPath(); ctx.moveTo(-26, -2); ctx.lineTo(-36, -16); ctx.lineTo(-28, -2); ctx.closePath(); ctx.fill()
  
    // Flame
    if (!crashed) {
      const flicker = 0.8 + Math.random() * 0.4
      ctx.shadowBlur = 20; ctx.shadowColor = '#ffc107'
      const fg = ctx.createLinearGradient(-38, 0, -54, 0)
      fg.addColorStop(0,   `rgba(255,193,7,${0.9 * flicker})`)
      fg.addColorStop(0.5, `rgba(255,100,0,${0.6 * flicker})`)
      fg.addColorStop(1,   'rgba(255,50,0,0)')
      ctx.beginPath()
      ctx.ellipse(-46 * flicker, 2, 12 * flicker, 5, 0, 0, Math.PI * 2)
      ctx.fillStyle = fg; ctx.fill()
    }
    ctx.restore()
  }
  
  // ── Draw states ──────────────────────────────────────────────────────────
  function drawWaiting(w, h)  { drawBackground(); drawPlane(56, h - 56, false) }
  function drawCrashed(w, h)  { drawBackground(); drawTrajectory(w, h); if (points.length) { const l = points[points.length-1]; drawPlane(l.x, l.y, true) } }
  function drawFrame(w, h)    { drawBackground(); drawTrajectory(w, h); drawPlane(planeX, planeY, false) }
  
  // ── Animation loop ────────────────────────────────────────────────────────
  let lastTime = 0
  const SPEED  = 0.0012
  
  function animate(ts) {
    if (!aviatorStore.isFlying) return
    const delta = ts - lastTime; lastTime = ts
    t = Math.min(t + delta * SPEED * (1 + t * 0.5), 0.98)
  
    const w = canvas.value?.width || 600
    const h = canvas.value?.height || 300
    const pt = getPoint(t, w, h)
    planeX = pt.x; planeY = pt.y
    points.push({ x: pt.x, y: pt.y })
    if (points.length > 600) points.shift()
  
    drawFrame(w, h)
    animFrame = requestAnimationFrame(animate)
  }
  
  function startFlight() {
    t = 0; points = []
    lastTime = performance.now()
    animFrame = requestAnimationFrame(animate)
  }
  
  function stopFlight() { cancelAnimationFrame(animFrame) }
  
  // ── Watchers ──────────────────────────────────────────────────────────────
  watch(() => aviatorStore.isFlying, (flying) => {
    if (flying) {
      startFlight()
    } else {
      stopFlight()
      const w = canvas.value?.width || 600
      const h = canvas.value?.height || 300
      if (aviatorStore.isCrashed) drawCrashed(w, h)
    }
  })
  
  watch(() => aviatorStore.isWaiting, (waiting) => {
    if (!waiting) return
    countdown.value = 5
    clearInterval(countdownTimer)
    countdownTimer = setInterval(() => { countdown.value--; if (countdown.value <= 0) clearInterval(countdownTimer) }, 1000)
    const w = canvas.value?.width || 600
    const h = canvas.value?.height || 300
    drawWaiting(w, h)
  })
  
  // ── Lifecycle ─────────────────────────────────────────────────────────────
  onMounted(() => {
    ctx = canvas.value.getContext('2d')
    resize()
    const onResize = () => {
      resize()
      const w = canvas.value.width, h = canvas.value.height
      aviatorStore.isFlying ? drawFrame(w, h) : drawWaiting(w, h)
    }
    window.addEventListener('resize', onResize)
    drawWaiting(canvas.value.width, canvas.value.height)
    onUnmounted(() => { stopFlight(); clearInterval(countdownTimer); window.removeEventListener('resize', onResize) })
  })
  
  const multiplierClass = computed(() => {
    const m = aviatorStore.multiplier
    if (m < 2) return 'color-red'
    if (m < 5) return 'color-gold'
    if (m < 10) return 'color-green'
    return 'color-purple'
  })
  </script>
  
  <style scoped>
  .aviator-canvas {
    position: relative;
    width: 100%;
    height: 320px;
    border-radius: 16px;
    overflow: hidden;
    background: #06020f;
    border: 1px solid rgba(180, 30, 255, 0.2);
    box-shadow: 0 0 40px rgba(180, 30, 255, 0.08), inset 0 0 60px rgba(0,0,0,0.4);
  }
  .aviator-canvas__cvs { width: 100%; height: 100%; display: block; }
  .aviator-canvas__hud {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .hud-multiplier {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    text-shadow: 0 0 40px currentColor;
    transition: color 0.3s;
  }
  .hud-multiplier.color-red    { color: #ff1744; }
  .hud-multiplier.color-gold   { color: #ffc107; }
  .hud-multiplier.color-green  { color: #00e676; }
  .hud-multiplier.color-purple { color: #d500f9; }
  .hud-multiplier.crashed      { color: #ff1744; opacity: 0.5; }
  .hud-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase; margin-bottom: 4px;
  }
  .hud-countdown {
    font-family: 'Orbitron', monospace;
    font-size: 3.5rem; font-weight: 900;
    color: #ffc107;
    text-shadow: 0 0 30px rgba(255,193,7,0.5);
  }
  </style>