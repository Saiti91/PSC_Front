<!-- UserGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="user">
    <slot></slot>
  </AuthGuard>
</template>
