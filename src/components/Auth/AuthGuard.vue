<!-- AuthGuard.vue -->
<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode'

const props = defineProps({
  requiredRole: String,
});

const router = useRouter();

const token = Cookies.get('token');
let userRole = null;

if (token) {
  try {
    const decodedToken = VueJwtDecode.decode(token);
    userRole = decodedToken.urole;
  } catch (error) {
    console.error('Invalid token', error);
  }
}

if (!token || userRole !== props.requiredRole) {
  router.push('/login');
}
</script>

<template>
  <div v-if="userRole === requiredRole">
    <slot></slot>
  </div>
</template>
