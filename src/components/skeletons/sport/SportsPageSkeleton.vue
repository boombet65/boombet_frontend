<!-- components/skeletons/SportsPageSkeleton.vue -->
<template>
  <SkeletonLoader>
    <div class="min-h-screen bg-gray-900 pb-10">
      <!-- Sports Filter Tabs Skeleton -->
      <div class="sticky top-0 z-20 bg-gray-800 border-b border-gray-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            <div v-for="i in 6" :key="i" class="flex-shrink-0">
              <div class="h-8 w-20 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sports Content Skeleton -->
      <div class="max-w-7xl mx-auto mt-3 px-2">
        <!-- League 1 -->
        <div class="mb-4">
          <div class="sticky top-12 z-10 py-2 pl-1 bg-gray-900">
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
          </div>
        </div>

        <!-- League 2 -->
        <div class="mb-4">
          <div class="sticky top-12 z-10 py-2 pl-1 bg-gray-900">
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
            
            <div class="bg-gray-800 py-3 px-2 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex gap-2 mb-2">
                    <div class="h-3 w-12 bg-gray-700 rounded"></div>
                    <div class="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                  <div class="h-4 w-38 bg-gray-700 rounded mb-1"></div>
                  <div class="h-4 w-20 bg-gray-700 rounded"></div>
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
          <div class="sticky top-12 z-10 py-2 pl-1 bg-gray-900">
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

        <!-- No Matches Skeleton (hidden by default) -->
        <div class="hidden text-center py-12">
          <div class="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-3"></div>
          <div class="h-4 w-48 bg-gray-700 rounded mx-auto"></div>
          <div class="h-3 w-64 bg-gray-700 rounded mx-auto mt-1"></div>
        </div>
      </div>
    </div>
  </SkeletonLoader>
</template>

<script setup>
import SkeletonLoader from '../ui/SkeletonLoader.vue'
</script>