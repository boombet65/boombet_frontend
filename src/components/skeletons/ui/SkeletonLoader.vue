<!-- components/ui/skeleton/SkeletonLoader.vue -->
<template>
  <div class="skeleton-wrapper">
    <slot />
  </div>
</template>

<script setup>
// Skeleton loader base component with shimmer animation
</script>

<style scoped>
.skeleton-wrapper {
  position: relative;
  overflow: hidden;
}

/* Shimmer effect - inaenda left */
.skeleton-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 100%
  );
  animation: shimmerLeft 2s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes shimmerLeft {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Apply to all child elements with bg-gray-700 */
.skeleton-wrapper :deep(.bg-gray-700) {
  background: linear-gradient(
    90deg,
    #374151 0%,
    #4B5563 50%,
    #374151 100%
  );
  background-size: 200% 100%;
  animation: shimmerBg 2s ease-in-out infinite;
  border-radius: 0.5rem;
}

@keyframes shimmerBg {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Different delay for each element to create wave effect */
.skeleton-wrapper :deep(.bg-gray-700:nth-child(1)) {
  animation-delay: 0s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(2)) {
  animation-delay: 0.15s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(3)) {
  animation-delay: 0.3s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(4)) {
  animation-delay: 0.45s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(5)) {
  animation-delay: 0.6s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(6)) {
  animation-delay: 0.75s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(7)) {
  animation-delay: 0.9s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(8)) {
  animation-delay: 1.05s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(9)) {
  animation-delay: 1.2s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(10)) {
  animation-delay: 1.35s;
}

/* Override specific rounded elements */
.skeleton-wrapper :deep(.rounded-full) {
  border-radius: 9999px;
}

.skeleton-wrapper :deep(.rounded-lg) {
  border-radius: 0.5rem;
}

.skeleton-wrapper :deep(.rounded-xl) {
  border-radius: 0.75rem;
}

/* Optional: Glowing effect */
.skeleton-wrapper :deep(.bg-gray-700) {
  position: relative;
  overflow: hidden;
}

.skeleton-wrapper :deep(.bg-gray-700)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 30%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 70%,
    transparent 100%
  );
  animation: shimmerLeft 2.5s ease-in-out infinite;
  animation-delay: inherit;
}
</style>