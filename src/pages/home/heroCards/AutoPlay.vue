<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State
const currentSlide = ref(0)
const slideInterval = ref(null)
const isAnimating = ref(false)

// Data - Premium Betting/Sports Images (No players celebrating goals)
const slides = ref([
  {
    title: 'PREMIUM SPORTSBOOK',
    subtitle: 'Best odds on football, basketball & tennis',
    image: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    buttonText: 'Bet Now',
    badge: 'EXCLUSIVE'
  },
  {
    title: 'LIVE BETTING',
    subtitle: 'Real-time odds as the action unfolds',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    buttonText: 'Live Now',
    badge: 'LIVE'
  },
  {
    title: 'FOOTBALL SPECIALS',
    subtitle: 'EPL, UCL, La Liga - Enhanced odds daily',
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    buttonText: 'Place Bet',
    badge: 'PROMO'
  },
  {
    title: 'BASKETBALL ODDS',
    subtitle: 'NBA & EuroLeague - Best market prices',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    buttonText: 'Bet Now',
    badge: 'SPORTS'
  },
  {
    title: 'CASINO & SLOTS',
    subtitle: 'Premium casino games with huge jackpots',
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    buttonText: 'Play Now',
    badge: 'CASINO'
  }
])

// Methods
const startAutoSlide = () => {
  slideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoSlide = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

const nextSlide = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  setTimeout(() => { isAnimating.value = false }, 800)
}

const prevSlide = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  setTimeout(() => { isAnimating.value = false }, 800)
}

const goToSlide = (index) => {
  if (isAnimating.value || currentSlide.value === index) return
  isAnimating.value = true
  currentSlide.value = index
  setTimeout(() => { isAnimating.value = false }, 800)
}

const handleMouseEnter = () => stopAutoSlide()
const handleMouseLeave = () => startAutoSlide()

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="premium-carousel w-full h-30 overflow-hidden relative">
    <div 
      class="relative h-full w-full"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Slides with Premium Animations -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="slide-item absolute inset-0 w-full h-full"
        :class="{ 'active': currentSlide === index }"
      >
        <!-- Background Image with Ken Burns Zoom Effect -->
        <div
          class="absolute inset-0 bg-cover bg-center transition-all duration-[8000ms] ease-out"
          :class="{ 'ken-burns-zoom': currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        ></div>

        <!-- Premium Animated Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-900/60 via-black/50 to-cyan-950/60"></div>
        
        <!-- Animated Shimmer Effect -->
        <div class="absolute inset-0 opacity-0 shimmer-effect" :class="{ 'animate-shimmer': currentSlide === index }"></div>

        <!-- Animated Particle Overlay -->
        <div class="absolute inset-0 particle-overlay" :class="{ 'animate-particles': currentSlide === index }"></div>

        <!-- Content with Staggered Animations -->
        <div class="relative z-10 h-full flex items-center justify-between px-4 md:px-8 lg:px-12">
          <!-- Left side - Badge & Text -->
          <div class="flex flex-col md:flex-row md:items-center gap-3">

            <!-- Badge with Pulse Animation -->
            <span class="inline-block px-3 py-1 text-[10px] md:text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-orange-600 to-orange-500 rounded-full shadow-lg whitespace-nowrap animate-slide-in-left">
              {{ slide.badge }}
            </span>

            <!-- Title with Glow Effect -->
            <h2 class="text-sm md:text-base lg:text-lg font-black text-white whitespace-nowrap animate-slide-in-left animate-glow" style="animation-delay: 0.1s">
              {{ slide.title }}
            </h2>

            <!-- Divider with Scale Animation -->
            <div class="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-orange-500 to-transparent animate-scale-in" style="animation-delay: 0.2s"></div>
            
            <!-- Subtitle with Fade Up -->
            <p class="text-xs md:text-sm text-gray-200 hidden md:block animate-fade-in-up" style="animation-delay: 0.2s">
              {{ slide.subtitle }}
            </p>
          </div>

          <!-- Right side - Premium Animated Button -->
          <button class="group relative px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full font-bold text-[11px] md:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:shadow-orange-500/50 whitespace-nowrap animate-slide-in-right animate-float">
            <span class="relative z-10">{{ slide.buttonText }}</span>
            <!-- Button Ripple Effect -->
            <span class="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span class="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100"></span>
          </button>
        </div>
      </div>

      <!-- Premium Navigation Dots -->
      <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="group relative"
        >
          <span 
            class="block h-1 rounded-full transition-all duration-500 ease-out"
            :class="currentSlide === index ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-500/50' : 'w-2 bg-white/40 group-hover:bg-white/70 group-hover:w-3'"
          ></span>
          <!-- Animated dot glow -->
          <span v-if="currentSlide === index" class="absolute -inset-1 rounded-full bg-orange-500/30 animate-ping"></span>
        </button>
      </div>

      <!-- Premium Navigation Arrows with Glow -->
      <button
        @click="prevSlide"
        class="left-2 md:left-4 absolute top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 bg-black/50 backdrop-blur-md hover:bg-orange-600 rounded-full flex items-center justify-center text-white z-20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 group"
        aria-label="Previous slide"
      >
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        @click="nextSlide"
        class="right-2 md:right-4 absolute top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 bg-black/50 backdrop-blur-md hover:bg-orange-600 rounded-full flex items-center justify-center text-white z-20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 group"
        aria-label="Next slide"
      >
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Animated Progress Bar -->
      <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_100%] transition-all duration-[5000ms] linear"
          :class="{ 'w-full animate-progress-shimmer': slideInterval }"
          :style="{ width: slideInterval ? '100%' : '0%' }"
          :key="currentSlide"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-carousel {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Slide Transitions */
.slide-item {
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.slide-item.active {
  opacity: 1;
  z-index: 2;
}

/* Ken Burns Zoom Effect */
.ken-burns-zoom {
  animation: kenBurns 8s ease-out forwards;
}

@keyframes kenBurns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.15);
  }
}

/* Shimmer Effect */
.shimmer-effect {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  background-size: 200% 100%;
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 200% 0;
    opacity: 0;
  }
}

/* Particle Effect */
.particle-overlay {
  background-image: radial-gradient(circle at 20% 50%, rgba(255,165,0,0.1) 2px, transparent 2px),
                    radial-gradient(circle at 80% 80%, rgba(255,165,0,0.08) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  background-position: 0 0, 20px 20px;
}

.animate-particles {
  animation: particles 20s linear infinite;
}

@keyframes particles {
  0% {
    background-position: 0 0, 20px 20px;
  }
  100% {
    background-position: 50px 50px, 70px 70px;
  }
}

/* Text Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform-origin: center;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Text Glow Effect */
.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 5px rgba(249, 115, 22, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(249, 115, 22, 0.6);
  }
}

/* Progress Bar Shimmer */
.animate-progress-shimmer {
  background: linear-gradient(90deg, 
    #ea580c 0%, 
    #f97316 25%, 
    #fbbf24 50%, 
    #f97316 75%, 
    #ea580c 100%
  );
  background-size: 200% 100%;
  animation: progressShimmer 1s linear infinite;
}

@keyframes progressShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Button Active State */
button:active {
  transform: scale(0.95);
}

/* Hover Effects */
button:hover {
  cursor: pointer;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .animate-glow {
    animation: none;
  }
  
  .shimmer-effect {
    display: none;
  }
}
</style>