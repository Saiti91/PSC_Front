<!-- HeaderAdmin.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '../utils/axios.js'; // Assurez-vous que le chemin est correct
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import 'semantic-ui-css/semantic.min.css';

const services = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/services');
    services.value = response.data;
  } catch (error) {
    console.error('Error loading services', error);
  }
});

function logout() {
  Cookies.remove('token');
  router.push('/login');
}
</script>

<template>
  <div class="ui top fixed menu">
    <div class="ui container">
      <router-link to="/" class="header item">
        <img class="logo" src="" alt="Admin Dashboard Logo"> Admin Dashboard
      </router-link>
      <div class="right menu">
        <router-link to="/service-admin" class="item">Services</router-link>
        <router-link to="/user-admin" class="item">Users</router-link>
        <router-link to="/admin/settings" class="item">Settings</router-link>
        <a class="item" @click="logout">Logout</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui.menu {
  background-color: #343a40 !important; /* Overriding default Semantic UI color */
  border-radius: 0; /* Remove rounding corners if present */
}

.logo {
  width: 30px; /* Adjust according to your preference */
  margin-right: 10px; /* Space between logo and text */
}

.header.item {
  color: #fff !important; /* Ensuring text is white */
}
</style>
