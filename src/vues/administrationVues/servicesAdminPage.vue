<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';

const services = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);

const fetchServices = async () => {
  error.value = null;
  try {
    const response = await fetch('http://localhost:80/services');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    services.value = data;
  } catch (err) {
    error.value = err.message;
  }
};

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return services.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(services.value.length / pageSize.value));

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

onMounted(fetchServices);
</script>


<template>
  <div class="admin-container">
    <HeaderComponent />
    <div class="content">
      <h1>Admin Services</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="controls">
          <label for="pageSize">Services per page:</label>
          <select v-model="pageSize" @change="fetchServices">
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <table class="services-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="service in paginatedServices" :key="service.id">
            <td>{{ service.id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.description }}</td>
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
    <FooterComponent />
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

.services-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.services-table th, .services-table td {
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
