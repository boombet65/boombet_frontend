<!-- components/skeletons/BottomNavSkeleton.vue -->
<template>
  <SkeletonLoader>
    <nav class="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-pb">
      <div class="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/40 to-transparent" />

      <div class="relative bg-[#0A0A0B]/95 backdrop-blur-2xl border-t border-[#221C16]">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF6A]/35 to-transparent" />

        <div class="flex items-end justify-around h-[64px] px-1">

          <!-- HOME -->
          <div class="flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2">
            <div class="relative w-[21px] h-[21px]">
              <div class="w-full h-full bg-gray-700 rounded"></div>
            </div>
            <div class="h-2 w-8 bg-gray-700 rounded"></div>
          </div>

          <!-- SPORTS -->
          <div class="flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2">
            <div class="relative w-[21px] h-[21px]">
              <div class="w-full h-full bg-gray-700 rounded"></div>
            </div>
            <div class="h-2 w-10 bg-gray-700 rounded"></div>
          </div>

          <!-- BET SLIP (Center Button) -->
          <div class="relative flex-1 flex justify-center">
            <div class="absolute -top-15 flex flex-col items-center justify-center w-[60px] h-[60px] rounded-full">
              <span class="absolute inset-0 rounded-full bg-gray-700" />
              <span class="relative w-[52px] h-[52px] rounded-full flex flex-col items-center justify-center gap-0.5 bg-gray-700">
                <div class="w-[19px] h-[19px] bg-gray-600 rounded"></div>
                <div class="h-2 w-6 bg-gray-600 rounded"></div>
              </span>
            </div>
          </div>

          <!-- MY BETS -->
          <div class="flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2">
            <div class="relative w-[21px] h-[21px]">
              <div class="w-full h-full bg-gray-700 rounded"></div>
            </div>
            <div class="h-2 w-10 bg-gray-700 rounded"></div>
          </div>

          <!-- ACCOUNT / PROFILE -->
          <div class="flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2">
            <div class="relative w-[21px] h-[21px]">
              <div class="w-full h-full bg-gray-700 rounded"></div>
            </div>
            <div class="h-2 w-10 bg-gray-700 rounded"></div>
          </div>

        </div>
      </div>
    </nav>
  </SkeletonLoader>
</template>

<script setup>
import SkeletonLoader from '../ui/SkeletonLoader.vue'
</script>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>