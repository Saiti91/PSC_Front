<!-- HeaderAdmin.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '../utils/axios.js'; // Assurez-vous que le chemin est correct
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

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
  router.push('/logout');
}
</script>

<template>
  <div class="header-admin">
    <nav class="navbar">
      <router-link to="/" class="brand">Admin Dashboard</router-link>
      <ul class="nav-links">
        <li><router-link to="/service-admin">Services</router-link></li>
        <li><router-link to="/user-admin">Users</router-link></li>
        <li><router-link to="/admin/settings">Settings</router-link></li>
        <li @click="logout"><a href="#">Logout</a></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.header-admin {
  height: 50px;
  background-color: #343a40;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>
