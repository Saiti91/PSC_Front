<!-- OwnerGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="owner">
    <slot></slot>
  </AuthGuard>
</template>
