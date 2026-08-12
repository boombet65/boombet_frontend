<template>
    <div class="aviator-canvas" ref="canvasWrap">
      <canvas ref="canvas" class="aviator-canvas__cvs" />
  
      <div class="aviator-canvas__hud">
        <template v-if="aviatorStore.isWaiting">
          <p class="hud-label">NEXT ROUND IN</p>
          <p class="hud-countdown">{{ aviatorStore.countdown }}s</p>
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
  import { useAviatorStore } from '../../../stores/aviatorStore'
  
  const aviatorStore = useAviatorStore()
  const canvas       = ref(null)
  const canvasWrap   = ref(null)
  
  let ctx, animFrame
  let points = []
  let t      = 0
  
  function resize() {
    if (!canvas.value || !canvasWrap.value) return
    canvas.value.width  = canvasWrap.value.clientWidth
    canvas.value.height = canvasWrap.value.clientHeight
  }
  
  // ── Background ────────────────────────────────────────────────────────────
  function drawBackground() {
    const w = canvas.value.width
    const h = canvas.value.height
  
    // Dark background
    ctx.fillStyle = '#0a0520'
    ctx.fillRect(0, 0, w, h)
  
    // Rays zinatoka chini-kushoto — kama Spribe exactly
    const cx = w * 0.05
    const cy = h * 1.02
    const rayCount = 32
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 0.75 + Math.PI * 0.1
      const x2 = cx + Math.cos(angle) * w * 3
      const y2 = cy - Math.sin(angle) * h * 3
      const g = ctx.createLinearGradient(cx, cy, x2, y2)
      g.addColorStop(0,   'rgba(100,40,200,0.12)')
      g.addColorStop(0.3, 'rgba(80,20,180,0.05)')
      g.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = g
      ctx.lineWidth   = w / rayCount * 1.8
      ctx.stroke()
    }
  
    // Grid horizontal
    ctx.strokeStyle = 'rgba(120,50,220,0.07)'
    ctx.lineWidth   = 1
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }
    // Grid vertical
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
    }
  }
  
  // ── Progress kutoka multiplier ────────────────────────────────────────────
  function getProgress(m) {
    return Math.min(Math.log(Math.max(m, 1)) / Math.log(80), 1)
  }
  
  // ── Curve point — inaigiza Spribe ────────────────────────────────────────
  // Inaanza chini-kushoto, inakwea juu-kulia kwa quadratic
  function getPoint(p, w, h) {
    const padL = w * 0.08   // margin kushoto
    const padB = h * 0.12   // margin chini
  
    // X: inaenda linearly kulia
    const x = padL + p * (w - padL - 30)
  
    // Y: quadratic — inaanza flat, inakwea steep
    // pow(p, 1.7) inafanya iwe flat mwanzoni kama Spribe
    const y = (h - padB) - Math.pow(p, 1.7) * (h - padB - 20)
  
    return { x, y }
  }
  
  // ── Trajectory + fill ─────────────────────────────────────────────────────
  function drawTrajectory(w, h) {
    if (points.length < 2) return
  
    const first  = points[0]
    const last   = points[points.length - 1]
    const baseY  = h - h * 0.12
  
    // Fill nyekundu chini ya curve
    ctx.save()
    const fill = ctx.createLinearGradient(0, baseY, 0, 0)
    fill.addColorStop(0,   'rgba(220,30,60,0.35)')
    fill.addColorStop(0.6, 'rgba(220,30,60,0.08)')
    fill.addColorStop(1,   'rgba(220,30,60,0)')
    ctx.beginPath()
    ctx.moveTo(first.x, baseY)
    ctx.lineTo(first.x, first.y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.lineTo(last.x, baseY)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    ctx.restore()
  
    // Line nyekundu
    ctx.save()
    ctx.shadowBlur  = 14
    ctx.shadowColor = '#ff1744'
    ctx.beginPath()
    ctx.moveTo(first.x, first.y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
    ctx.strokeStyle = '#ff2244'
    ctx.lineWidth   = 2.5
    ctx.lineJoin    = 'round'
    ctx.lineCap     = 'round'
    ctx.stroke()
    ctx.restore()
  }
  
  // ── Ndege — anaelekea KULIA, kama Spribe ─────────────────────────────────
  function drawPlane(x, y, crashed) {
    ctx.save()
    ctx.translate(x, y)
  
    // Angle: inaanza -30° (inaelekea juu-kulia), polepole inakuwa 0° (flat)
    let angle = crashed
      ? Math.PI * 0.15
      : -(0.32 - t * 0.28)   // smooth transition kutoka steep hadi flat
  
    ctx.rotate(angle)
  
    if (!crashed) {
      ctx.shadowBlur  = 24
      ctx.shadowColor = 'rgba(255,50,80,0.6)'
    }
  
    const s = 1.3   // scale — mkubwa kidogo kama Spribe
    ctx.scale(s, s)
  
    // ── Mwili wa ndege (body) ──
    ctx.fillStyle = crashed ? '#666' : '#ff2244'
  
    // Fuselage
    ctx.beginPath()
    ctx.moveTo(-30, 0)
    ctx.bezierCurveTo(-20, -8, 10, -8, 30, 0)
    ctx.bezierCurveTo(10,   8, -20,  8, -30, 0)
    ctx.closePath()
    ctx.fill()
  
    // Nose — pointed kulia
    ctx.beginPath()
    ctx.moveTo(28, -2)
    ctx.lineTo(46, 0)
    ctx.lineTo(28, 3)
    ctx.closePath()
    ctx.fill()
  
    // Wing kubwa (juu)
    ctx.beginPath()
    ctx.moveTo(8, -4)
    ctx.lineTo(-2, -28)
    ctx.lineTo(-18, -30)
    ctx.lineTo(-14, -4)
    ctx.closePath()
    ctx.fill()
  
    // Wing ndogo (chini)
    ctx.beginPath()
    ctx.moveTo(6, 4)
    ctx.lineTo(-2, 18)
    ctx.lineTo(-14, 18)
    ctx.lineTo(-10, 4)
    ctx.closePath()
    ctx.fill()
  
    // Tail fin
    ctx.beginPath()
    ctx.moveTo(-22, -2)
    ctx.lineTo(-34, -18)
    ctx.lineTo(-26, -2)
    ctx.closePath()
    ctx.fill()
  
    // Horizontal stabilizer
    ctx.beginPath()
    ctx.moveTo(-22, 2)
    ctx.lineTo(-34, 8)
    ctx.lineTo(-28, 2)
    ctx.closePath()
    ctx.fill()
  
    // ── Flame ya engine (nyuma ya ndege) ──
    if (!crashed) {
      const flk = 0.85 + Math.random() * 0.3
      ctx.shadowBlur  = 20
      ctx.shadowColor = '#ff8800'
  
      // Outer flame
      const fg1 = ctx.createLinearGradient(-32, 0, -56 * flk, 0)
      fg1.addColorStop(0,   `rgba(255,160,0,${0.9 * flk})`)
      fg1.addColorStop(0.5, `rgba(255,80,0,${0.5 * flk})`)
      fg1.addColorStop(1,   'rgba(255,30,0,0)')
      ctx.beginPath()
      ctx.ellipse(-42 * flk, 0, 14 * flk, 6, 0, 0, Math.PI * 2)
      ctx.fillStyle = fg1
      ctx.fill()
  
      // Inner flame (brighter)
      const fg2 = ctx.createLinearGradient(-32, 0, -48 * flk, 0)
      fg2.addColorStop(0,   `rgba(255,240,180,${0.95 * flk})`)
      fg2.addColorStop(1,   'rgba(255,200,0,0)')
      ctx.beginPath()
      ctx.ellipse(-38 * flk, 0, 8 * flk, 3.5, 0, 0, Math.PI * 2)
      ctx.fillStyle = fg2
      ctx.fill()
    }
  
    ctx.restore()
  }
  
  // ── Draw states ───────────────────────────────────────────────────────────
  function drawWaiting() {
    const w = canvas.value.width
    const h = canvas.value.height
    drawBackground()
    // Ndege idle — chini-kushoto
    const startX = w * 0.08 + 30
    const startY = h - h * 0.12 - 10
    drawPlane(startX, startY, false)
  }
  
  function drawFlying() {
    const w = canvas.value.width
    const h = canvas.value.height
    drawBackground()
    drawTrajectory(w, h)
    drawPlane(points[points.length - 1].x, points[points.length - 1].y, false)
  }
  
  function drawCrashed() {
    const w = canvas.value.width
    const h = canvas.value.height
    drawBackground()
    drawTrajectory(w, h)
    if (points.length) {
      const last = points[points.length - 1]
      drawPlane(last.x, last.y, true)
    }
  }
  
  // ── Animation loop ────────────────────────────────────────────────────────
  function animate() {
    if (!aviatorStore.isFlying) return
  
    const m = aviatorStore.multiplier
    t = getProgress(m)
  
    const w  = canvas.value?.width  || 600
    const h  = canvas.value?.height || 340
    const pt = getPoint(t, w, h)
  
    points.push({ x: pt.x, y: pt.y })
    if (points.length > 1200) points.shift()
  
    drawFlying()
    animFrame = requestAnimationFrame(animate)
  }
  
  function startFlight() {
    t = 0; points = []
    cancelAnimationFrame(animFrame)
    animFrame = requestAnimationFrame(animate)
  }
  
  function stopFlight() { cancelAnimationFrame(animFrame) }
  
  // ── Watchers ──────────────────────────────────────────────────────────────
  watch(() => aviatorStore.isFlying, (v) => {
    if (v) { startFlight() }
    else   { stopFlight(); if (aviatorStore.isCrashed) drawCrashed() }
  })
  
  watch(() => aviatorStore.isWaiting, (v) => { if (v) drawWaiting() })
  
  // ── Lifecycle ─────────────────────────────────────────────────────────────
  onMounted(() => {
    ctx = canvas.value.getContext('2d')
    resize()
    const onResize = () => {
      resize()
      if      (aviatorStore.isFlying)  drawFlying()
      else if (aviatorStore.isCrashed) drawCrashed()
      else                             drawWaiting()
    }
    window.addEventListener('resize', onResize)
    drawWaiting()
    onUnmounted(() => { stopFlight(); window.removeEventListener('resize', onResize) })
  })
  
  const multiplierClass = computed(() => {
    const m = aviatorStore.multiplier
    if (m < 2)  return 'color-red'
    if (m < 5)  return 'color-gold'
    if (m < 10) return 'color-green'
    return 'color-purple'
  })
  </script>
  
  <style scoped>
  .aviator-canvas {
    position: relative;
    width: 100%;
    height: 340px;
    border-radius: 16px;
    overflow: hidden;
    background: #0a0520;
    border: 1px solid rgba(150, 50, 255, 0.15);
    box-shadow: 0 0 48px rgba(120, 30, 220, 0.08);
  }
  .aviator-canvas__cvs  { width: 100%; height: 100%; display: block; }
  .aviator-canvas__hud  {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none;
  }
  .hud-multiplier {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2.8rem, 9vw, 5.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    text-shadow: 0 0 48px currentColor;
    transition: color 0.25s;
  }
  .hud-multiplier.color-red    { color: #ff1744; }
  .hud-multiplier.color-gold   { color: #ffc107; }
  .hud-multiplier.color-green  { color: #00e676; }
  .hud-multiplier.color-purple { color: #d500f9; }
  .hud-multiplier.crashed      { color: #ff1744; opacity: 0.45; }
  .hud-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase; margin-bottom: 6px;
  }
  .hud-countdown {
    font-family: 'Orbitron', monospace;
    font-size: 4rem; font-weight: 900;
    color: #ffc107;
    text-shadow: 0 0 32px rgba(255,193,7,0.55);
  }
  </style>