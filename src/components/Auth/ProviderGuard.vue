<!-- ProviderGuard.vue -->
<script setup>
import AuthGuard from './AuthGuard.vue';
</script>

<template>
  <AuthGuard requiredRole="provider">
    <slot></slot>
  </AuthGuard>
</template>
