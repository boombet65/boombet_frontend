<!-- components/skeletons/HomePageSkeleton.vue -->
<template>
  <SkeletonLoader>
    <div class="mx-auto bg-gray-900 min-h-screen pb-10">
      <!-- Hero Section Skeleton -->
      <div class="relative overflow-hidden h-[120px] w-full bg-gray-800 border-b border-gray-700">
        <div class="flex h-full">
          <div class="min-w-full h-full bg-gray-800 flex items-end p-2">
            <div class="absolute right-8 top-1/2 -translate-y-1/2 text-[90px] opacity-20 text-gray-600">🎁</div>
            <div class="relative z-20 flex flex-col gap-1 max-w-[70%]">
              <div class="h-5 w-28 bg-gray-700 rounded-full"></div>
              <div class="h-6 w-48 bg-gray-700 rounded"></div>
              <div class="h-3 w-52 bg-gray-700 rounded"></div>
              <div class="h-7 w-24 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div class="h-1.5 w-5 bg-gray-700 rounded-full"></div>
          <div class="h-1.5 w-1.5 bg-gray-700 rounded-full"></div>
          <div class="h-1.5 w-1.5 bg-gray-700 rounded-full"></div>
          <div class="h-1.5 w-1.5 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <!-- Games Tabs Skeleton -->
      <section class="w-full bg-gray-900">
        <div class="max-w-screen-xl mx-auto relative">
          <div class="relative px-4 py-3">
            <div class="overflow-x-auto scrollbar-hide">
              <div class="flex gap-2 sm:gap-3">
                <div v-for="i in 8" :key="i" class="relative w-[65px] h-[65px] flex-shrink-0">
                  <div class="w-full h-full bg-gray-700 rounded-md overflow-hidden relative">
                    <div class="absolute inset-0 flex items-center justify-between p-1">
                      <div class="w-4 h-4 bg-gray-600 rounded"></div>
                      <div class="w-4 h-4 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- League Groups Skeleton -->
      <div class="px-2 mt-3">
        <!-- League 1 -->
        <div class="mb-4">
          <div class="sticky top-0 z-10 py-2 pl-1 bg-gray-900">
            <div class="flex items-center justify-between">
              <div class="h-4 w-40 bg-gray-700 rounded"></div>
              <div class="flex gap-1">
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          <!-- Match Cards Skeleton -->
          <div class="space-y-1">
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-32 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-28 bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-1">
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-36 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-24 bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-1">
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- League 2 -->
        <div class="mb-4">
          <div class="sticky top-0 z-10 py-2 pl-1 bg-gray-900">
            <div class="flex items-center justify-between">
              <div class="h-4 w-44 bg-gray-700 rounded"></div>
              <div class="flex gap-1">
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          <div class="space-y-1">
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-30 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-26 bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-1">
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-34 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-22 bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-1">
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- League 3 -->
        <div class="mb-4">
          <div class="sticky top-0 z-10 py-2 pl-1 bg-gray-900">
            <div class="flex items-center justify-between">
              <div class="h-4 w-36 bg-gray-700 rounded"></div>
              <div class="flex gap-1">
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
                <div class="h-4 w-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          
          <div class="space-y-1">
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-28 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-32 bg-gray-700 rounded"></div>
                </div>
                <div class="flex gap-1">
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                  <div class="h-8 w-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button Skeleton -->
      <div class="text-center py-3 bg-gray-800 border-t border-gray-700">
        <div class="h-5 w-32 bg-gray-700 rounded mx-auto"></div>
      </div>
      
      <!-- Recent Winners Skeleton -->
      <div class="px-4 py-4">
        <div class="flex gap-3 overflow-x-auto">
          <div v-for="i in 3" :key="i" class="flex-shrink-0 w-48 bg-gray-800 rounded-xl p-3 border border-gray-700">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div class="flex-1">
                <div class="h-3 w-20 bg-gray-700 rounded"></div>
                <div class="h-2 w-24 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
            <div class="mt-2">
              <div class="h-3 w-32 bg-gray-700 rounded"></div>
              <div class="h-3 w-28 bg-gray-700 rounded mt-1"></div>
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