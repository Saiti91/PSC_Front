<!-- AdminGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="admin">
    <slot></slot>
  </AuthGuard>
</template>
