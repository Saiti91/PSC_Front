<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/axios.js';
import 'semantic-ui-css/semantic.min.css';


const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);

const fetchUsers = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/users');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return users.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / pageSize.value));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(fetchUsers);
</script>
<template>
  <div class="ui container" style="height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="ui basic segment flex-grow" style="overflow: auto;">
      <h1 class="ui header">Admin Users</h1>
      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <div class="ui form">
          <div class="field">
            <label>Users per page:</label>
            <select class="ui dropdown" v-model="pageSize" @change="fetchUsers">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <table class="ui celled table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.users_id">
            <td>{{ user.users_id }}</td>
            <td>{{ new Date(user.created_at).toLocaleString() }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.email }}</td>
          </tr>
          </tbody>
        </table>
        <div class="ui pagination menu">
          <a class="item" @click="prevPage" :class="{disabled: currentPage === 1}">Previous</a>
          <div class="item">Page {{ currentPage }}</div>
          <a class="item" @click="nextPage" :class="{disabled: currentPage === totalPages}">Next</a>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>

</style>
