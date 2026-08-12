<!-- components/skeletons/DefaultLayoutSkeleton.vue -->
<template>
  <SkeletonLoader>
    <div class="min-h-screen bg-cyan-950/30 px-0 lg:px-45">
      <!-- Header Skeleton -->
      <header class="bg-cyan-800/30 shadow-lg sticky top-0 z-50 max-w-7xl mx-auto">
        <!-- ROW 1: Logo + User Actions -->
        <div class="flex items-center justify-between mx-auto px-1 h-14 bg-cyan-800 border-b border-cyan-700">
          <div class="flex items-center gap-1">
            <!-- Hamburger (mobile) -->
            <div class="lg:hidden flex items-center justify-center rounded-[10px] w-8 h-8">
              <div class="w-5 h-5 bg-gray-700 rounded"></div>
            </div>

            <!-- Logo -->
            <div class="flex items-center gap-1 select-none">
              <div class="hidden md:flex w-8 h-8 rounded-[8px] bg-gray-700 items-center justify-center"></div>
              <div class="h-5 w-16 bg-gray-700 rounded"></div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Live indicator -->
            <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-700">
              <div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
              <div class="h-3 w-8 bg-gray-600 rounded"></div>
            </div>

            <!-- Search button -->
            <div class="w-7 h-7 bg-gray-700 rounded-lg"></div>

            <!-- Login/Register buttons (guest) -->
            <div class="hidden sm:flex items-center gap-2">
              <div class="h-7 w-14 bg-gray-700 rounded"></div>
              <div class="h-7 w-20 bg-gray-700 rounded"></div>
            </div>

            <!-- Balance + Avatar (logged in) -->
            <div class="hidden sm:flex items-center gap-2">
              <div class="h-7 w-20 bg-gray-700 rounded"></div>
              <div class="w-7 h-7 rounded-full bg-gray-700"></div>
            </div>
          </div>
        </div>

        <!-- ROW 2: Search Bar (hidden by default) -->
        <div class="hidden py-2 sm:py-3 max-w-7xl mx-auto px-2">
          <div class="flex items-center gap-1 sm:gap-2">
            <div class="flex-1 relative min-w-0">
              <div class="w-full h-9 bg-gray-700 rounded-lg"></div>
            </div>
            <div class="h-9 w-16 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row">
          <!-- Main Content - Left Side -->
          <div class="flex-1 min-w-0 flex flex-col">
            <div class="flex-1 p-4">
              <!-- Content placeholder - will be replaced by actual page skeleton -->
              <div class="space-y-4">
                <div class="h-8 w-48 bg-gray-700 rounded"></div>
                <div class="h-4 w-full bg-gray-700 rounded"></div>
                <div class="h-4 w-3/4 bg-gray-700 rounded"></div>
                <div class="h-32 w-full bg-gray-700 rounded-lg"></div>
                <div class="h-20 w-full bg-gray-700 rounded-lg"></div>
                <div class="h-20 w-full bg-gray-700 rounded-lg"></div>
              </div>
            </div>
            
            <!-- Footer Skeleton -->
            <div class="lg:pb-0">
              <footer class="bg-cyan-800/30 text-gray-300 border-t border-gray-700">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 gap-5">
                  <!-- TOP ROW -->
                  <div class="flex flex-row sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4">
                    <div class="flex items-center space-x-2">
                      <div class="h-6 w-20 bg-gray-700 rounded"></div>
                    </div>
                    <div class="w-[110px] border-x-1 border-gray-600 px-1">
                      <div class="h-4 w-24 bg-gray-700 rounded mx-auto"></div>
                    </div>
                    <div class="flex flex-col items-center sm:items-end">
                      <div class="h-4 w-12 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  
                  <!-- Description -->
                  <div class="flex my-1.5 items-center justify-center">
                    <div class="h-3 w-48 bg-gray-700 rounded"></div>
                  </div>
                  
                  <!-- Payment Methods -->
                  <div class="text-center mt-5">
                    <div class="h-3 w-32 bg-gray-700 rounded mx-auto mb-3"></div>
                    <div class="flex items-center justify-center space-x-8">
                      <div class="h-4 w-12 bg-gray-700 rounded"></div>
                      <div class="h-4 w-16 bg-gray-700 rounded"></div>
                      <div class="h-4 w-10 bg-gray-700 rounded"></div>
                      <div class="h-4 w-14 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  
                  <!-- Region Links -->
                  <div class="flex items-center justify-center space-x-2 text-center my-6">
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                    <div class="h-3 w-px bg-gray-600"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  
                  <!-- Responsible Gambling -->
                  <div class="text-center space-y-2 max-w-2xl mx-auto">
                    <div class="flex items-center justify-center space-x-2">
                      <div class="h-4 w-8 bg-gray-700 rounded"></div>
                      <div class="h-3 w-48 bg-gray-700 rounded"></div>
                    </div>
                    <div class="h-3 w-64 bg-gray-700 rounded mx-auto"></div>
                    <div class="h-3 w-72 bg-gray-700 rounded mx-auto"></div>
                  </div>
                  
                  <!-- Divider -->
                  <div class="my-4 sm:my-6 border-t-2 border-gray-700"></div>
                  
                  <!-- Bottom Links -->
                  <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    <div class="h-3 w-32 bg-gray-700 rounded"></div>
                    <div class="h-3 w-px bg-gray-600"></div>
                    <div class="h-3 w-20 bg-gray-700 rounded"></div>
                    <div class="h-3 w-px bg-gray-600"></div>
                    <div class="h-3 w-24 bg-gray-700 rounded"></div>
                  </div>
                  
                  <!-- Back to Top & Copyright -->
                  <div class="mt-6 flex flex-col items-center">
                    <div class="flex flex-col my-2 py-2 justify-center text-xs flex items-center space-x-1 space-y-3 w-full">
                      <div class="h-8 w-full bg-cyan-700 rounded"></div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="h-3 w-8 bg-cyan-700 rounded"></div>
                      <div class="h-3 w-px bg-cyan-600"></div>
                      <div class="h-3 w-48 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>

          <!-- Right Sidebar Skeleton - Desktop only -->
          <div class="hidden lg:block flex-shrink-0 bg-cyan-800/30 border-l border-cyan-700 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto w-full lg:w-[300px] xl:w-[360px] 2xl:w-[420px]">
            <div class="p-4 space-y-4">
              <!-- Bet Slip Header -->
              <div class="flex items-center justify-between">
                <div class="h-6 w-24 bg-cyan-700 rounded"></div>
                <div class="h-6 w-6 bg-cyan-700 rounded"></div>
              </div>
              
              <!-- Empty State -->
              <div class="flex flex-col items-center justify-center gap-4 py-8">
                <div class="w-16 h-16 rounded-full bg-cyan-700"></div>
                <div class="h-4 w-32 bg-cyan-700 rounded"></div>
                <div class="h-3 w-48 bg-cyan-700 rounded"></div>
                <div class="w-full max-w-xs space-y-3 mt-2">
                  <div class="flex gap-2">
                    <div class="flex-1 h-10 bg-cyan-700 rounded-xl"></div>
                    <div class="h-10 w-16 bg-cyan-700 rounded-xl"></div>
                  </div>
                  <div class="h-8 w-full bg-cyan-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation Skeleton - Mobile only -->
      <div class="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-pb">
        <div class="relative bg-cyan-800/30 backdrop-blur-2xl border-t border-cyan-700">
          <div class="flex items-end justify-around h-[64px] px-1">
            <div v-for="i in 5" :key="i" class="flex flex-col items-center justify-center gap-1 flex-1 h-full pt-2.5 pb-2">
              <div class="w-[21px] h-[21px] bg-cyan-700 rounded"></div>
              <div class="h-2 w-10 bg-cyan-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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