<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/axios.js'; // Adjust the path accordingly
import 'semantic-ui-css/semantic.min.css';


const services = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);

const fetchServices = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/services');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    services.value = response.data;
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
  <div class="ui container" style="height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="ui basic segment flex-grow" style="overflow: auto;">
      <h1 class="ui header">Admin Services</h1>
      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <div class="ui form">
          <div class="inline field">
            <label>Services per page:</label>
            <select class="ui dropdown" v-model="pageSize" @change="fetchServices">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <table class="ui celled table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Provider Address</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="service in paginatedServices" :key="service.services_id">
            <td>{{ service.services_id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.type }}</td>
            <td>{{ service.provideraddress }}</td>
            <td>{{ service.price | currency }}</td>
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
.flex-grow {
  flex: 1;
  overflow: auto;
}
</style>