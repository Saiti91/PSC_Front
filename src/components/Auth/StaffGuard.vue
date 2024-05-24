<!-- StaffGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="staff">
    <slot></slot>
  </AuthGuard>
</template>
