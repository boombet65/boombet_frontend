<!-- components/skeletons/SportDetailSkeleton.vue -->
<template>
  <SkeletonLoader>
    <div class="min-h-screen bg-gray-900 pb-10">
      <!-- Header Skeleton -->
      <div class="sticky top-0 z-20 bg-gray-800 border-b border-gray-700 shadow-sm">
        <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div class="flex items-center justify-between sm:justify-center relative">
            <!-- Back Button Skeleton -->
            <div class="p-1.5 sm:p-2 flex-shrink-0 sm:absolute sm:left-0">
              <div class="h-5 w-5 sm:h-6 sm:w-6 bg-gray-700 rounded-full"></div>
            </div>
            
            <!-- Center Content Skeleton -->
            <div class="text-center flex-1 sm:flex-none px-1 sm:px-0">
              <div class="h-4 sm:h-7 bg-gray-700 rounded-lg w-40 sm:w-64 mx-auto"></div>
              <div class="h-2 sm:h-3 bg-gray-700 rounded-lg w-24 sm:w-40 mx-auto mt-1"></div>
            </div>

            <!-- Empty div -->
            <div class="w-8 sm:hidden"></div>
          </div>
        </div>
      </div>

      <!-- Match Details Content -->
      <div class="max-w-7xl mx-auto px-2 mt-4">
        <!-- Match Status Card Skeleton -->
        <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-3 mb-4">
          <div class="flex flex-col items-center">
            <!-- Status Badge Skeleton -->
            <div class="mb-2 sm:mb-4">
              <div class="h-5 sm:h-6 w-20 sm:w-28 bg-gray-700 rounded-full"></div>
            </div>

            <!-- Teams Skeleton -->
            <div class="flex items-center justify-between w-full max-w-2xl gap-1 sm:gap-4">
              <!-- Home Team -->
              <div class="flex flex-col items-center flex-1">
                <div class="w-10 h-10 sm:w-16 sm:h-16 bg-gray-700 rounded-full mb-1 sm:mb-2"></div>
                <div class="h-3 sm:h-4 bg-gray-700 rounded w-12 sm:w-20"></div>
                <div class="h-6 sm:h-8 bg-gray-700 rounded w-4 sm:w-6 mt-0.5 sm:mt-1"></div>
              </div>

              <!-- VS / Time -->
              <div class="flex flex-col items-center px-1 sm:px-4">
                <div class="h-3 sm:h-4 bg-gray-700 rounded w-4 sm:w-6"></div>
                <div class="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 rounded-full mt-1 sm:mt-2"></div>
              </div>

              <!-- Away Team -->
              <div class="flex flex-col items-center flex-1">
                <div class="w-10 h-10 sm:w-16 sm:h-16 bg-gray-700 rounded-full mb-1 sm:mb-2"></div>
                <div class="h-3 sm:h-4 bg-gray-700 rounded w-12 sm:w-20"></div>
                <div class="h-6 sm:h-8 bg-gray-700 rounded w-4 sm:w-6 mt-0.5 sm:mt-1"></div>
              </div>
            </div>

            <!-- Match Info Skeleton -->
            <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700 w-full">
              <div class="flex justify-center gap-4 sm:gap-8">
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 sm:h-4 sm:w-4 bg-gray-700 rounded"></div>
                  <div class="h-3 sm:h-4 bg-gray-700 rounded w-12 sm:w-16"></div>
                </div>
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 sm:h-4 sm:w-4 bg-gray-700 rounded"></div>
                  <div class="h-3 sm:h-4 bg-gray-700 rounded w-12 sm:w-16"></div>
                </div>
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 sm:h-4 sm:w-4 bg-gray-700 rounded"></div>
                  <div class="h-3 sm:h-4 bg-gray-700 rounded w-12 sm:w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Markets Section Skeleton -->
        <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-3 sm:p-4 mb-4">
          <div class="space-y-4 sm:space-y-6">
            
            <!-- 1. 1X2 Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-28 sm:w-36 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-3 gap-2 sm:gap-3">
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 2. Double Chance Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-32 sm:w-40 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-3 gap-2 sm:gap-3">
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 3. BTTS Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-36 sm:w-48 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 4. Over/Under Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-28 sm:w-36 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
                <div class="h-12 sm:h-16 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 5. Correct Score FT Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-32 sm:w-40 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 6. Correct Score FH Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-36 sm:w-44 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <!-- 7. Correct Score SH Skeleton -->
            <div>
              <div class="h-4 sm:h-5 bg-gray-700 rounded w-36 sm:w-44 mb-2 sm:mb-3"></div>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
                <div class="h-10 sm:h-12 bg-gray-700 rounded-lg"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </SkeletonLoader>
</template>

<script setup>
import SkeletonLoader from '../../ui/SkeletonLoader.vue'

</script>