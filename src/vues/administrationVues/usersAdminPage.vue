<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/axios.js'; // Adjust the path accordingly

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
  <div class="admin-container">
    <HeaderComponent/>
    <div class="content">
      <h1>Admin Users</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="controls">
          <label for="pageSize">Users per page:</label>
          <select v-model="pageSize" @change="fetchUsers">
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <table class="users-table">
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
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>
<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #f9f9f9;
}

.controls {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.controls label {
  margin-right: 0.5rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.users-table th, .users-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
