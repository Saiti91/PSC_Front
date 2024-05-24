<!-- MultiRoleAuthGuard.vue -->
<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const props = defineProps({
  allowedRoles: {
    type: Array,
    required: true
  }
});

const router = useRouter();

const token = Cookies.get('token');
let userRole = null;

if (token) {
  try {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.urole;
  } catch (error) {
    console.error('Invalid token', error);
  }
}

if (!token || !props.allowedRoles.includes(userRole)) {
  router.push('/login');
}
</script>

<template>
  <div v-if="allowedRoles.includes(userRole)">
    <slot></slot>
  </div>
</template>


<!--Exemple d'utilisation-->
<!--<script setup>-->
<!--import MultiRoleAuthGuard from './MultiRoleAuthGuard.vue';-->
<!--</script>-->

<!--<template>-->
<!--  <MultiRoleAuthGuard :allowedRoles="['admin', 'user']">-->
<!--    <h1>Admin and User Page</h1>-->
<!--Contenu-->
<!--  </MultiRoleAuthGuard>-->
<!--</template>-->