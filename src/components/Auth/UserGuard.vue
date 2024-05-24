<!-- UserGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="customer">
    <slot></slot>
  </AuthGuard>
</template>
