<script setup>
import {computed, onMounted, ref} from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import 'semantic-ui-css/semantic.min.css';
import {useRouter} from 'vue-router';
import DeleteModal from '@/components/DeleteModal.vue';
import SuccessModal from '@/components/SuccessModal.vue';

const services = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);
const router = useRouter();
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const serviceIdToDelete = ref(null);
const deletedServiceDetails = ref({});
const selectedCategory = ref('');
const selectedCity = ref('');
const categories = ref([]);
const cities = ref([]);

const fetchServices = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/services');
    console.log('Response:', response.data)
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    services.value = response.data.map(service => ({
      id: service.servicesproviders_id,
      name: service.name,
      serviceTypes: service.services ? service.services.map(s => s.serviceType_name).join(', ') : '',
      city: service.city,
      employeeCount: service.employee_count
    }));

    // Extract unique categories and cities
    const allCategories = new Set();
    const allCities = new Set();
    services.value.forEach(service => {
      service.serviceTypes.split(', ').forEach(category => allCategories.add(category));
      allCities.add(service.city);
    });
    categories.value = Array.from(allCategories);
    cities.value = Array.from(allCities);
  } catch (err) {
    error.value = err.message;
  }
};

const filteredServices = computed(() => {
  let filtered = services.value;
  if (selectedCategory.value) {
    filtered = filtered.filter(service => service.serviceTypes.includes(selectedCategory.value));
  }
  if (selectedCity.value) {
    filtered = filtered.filter(service => service.city === selectedCity.value);
  }
  return filtered;
});

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredServices.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredServices.value.length / pageSize.value));

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

const navigateToAddService = () => {
  router.push('/AddService');
};

const viewServiceDetails = (serviceId) => {
  router.push(`/services-admin/${serviceId}`);
};

const openDeleteModal = (serviceId) => {
  serviceIdToDelete.value = serviceId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    const service = services.value.find(s => s.id === serviceIdToDelete.value);
    await axiosInstance.delete(`/services/${serviceIdToDelete.value}/`);
    deletedServiceDetails.value = {id: service.id, category: service.serviceTypes, name: service.name};
    await fetchServices(); // Refresh the list after deletion
    showDeleteModal.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    error.value = 'Failed to delete the service.';
  }
};

onMounted(fetchServices);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <div class="header-container">
        <h1 class="ui header">{{ $t('service_administration') }}</h1>
        <div class="ui right aligned">
          <div class="custom-dropdown">
            <select v-model="selectedCategory">
              <option value="">{{ $t('all_categories') }}</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div class="custom-dropdown">
            <select v-model="selectedCity">
              <option value="">{{ $t('all_cities') }}</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <button class="ui primary button" @click="navigateToAddService">
            <i class="plus icon"></i>
          </button>
        </div>
      </div>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <table class="ui celled table centered-content">
          <thead>
          <tr>
            <th>{{ $t('name') }}</th>
            <th>{{ $t('service_type') }}</th>
            <th>{{ $t('city') }}</th>
            <th>{{ $t('employee_count') }}</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="service in paginatedServices" :key="service.id">
            <td>{{ service.name }}</td>
            <td>{{ service.serviceTypes }}</td>
            <td>{{ service.city }}</td>
            <td>{{ service.employeeCount }}</td>
            <td>
              <button class="ui icon button" @click="viewServiceDetails(service.id)">
                <i class="eye icon"></i>
              </button>
              <button class="ui icon button" @click="openDeleteModal(service.id)">
                <i class="trash icon"></i>
              </button>
              <button class="ui icon button">
                <i class="ellipsis horizontal icon"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="pagination-settings">
          <div class="items-per-page">
            <label>{{ $t('services_per_page') }}</label>
            <select v-model="pageSize" class="ui dropdown narrow-dropdown" @change="fetchServices">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div class="ui pagination menu">
            <a :class="{disabled: currentPage === 1}" class="item" @click="prevPage">{{ $t('previous') }}</a>
            <div class="item">Page {{ currentPage }}</div>
            <a :class="{disabled: currentPage === totalPages}" class="item" @click="nextPage">{{ $t('next') }}</a>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>

    <!-- Custom Delete Modal -->
    <DeleteModal :serviceId="serviceIdToDelete" :show="showDeleteModal" @close="showDeleteModal = false"
                 @confirm="confirmDelete"/>

    <!-- Custom Success Modal -->
    <SuccessModal :details="deletedServiceDetails" :show="showSuccessModal" @close="showSuccessModal = false"/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.custom-dropdown {
  display: inline-block;
  position: relative;
  margin-right: 10px; /* Add margin to separate the dropdowns */
}

.custom-dropdown select {
  display: block;
  width: 150px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: white url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z' fill='%23666'/%3E%3C/svg%3E") no-repeat right 10px center;
  background-size: 12px;
}

.custom-dropdown::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 15px;
  width: 0;
  height: 0;
  pointer-events: none;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-container .ui.right.aligned {
  display: flex;
  align-items: center;
}

.header-container .ui.right.aligned .ui.dropdown {
  margin-right: 10px;
}

.ui.form .field {
  width: 100%;
}

.ui.icon.button {
  margin: 0 5px;
}

.pagination-settings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}

.items-per-page {
  display: flex;
  align-items: center;
}

.items-per-page label {
  margin-right: 10px;
}

.ui.pagination.menu {
  display: flex;
  align-items: center;
}

.centered-content th, .centered-content td {
  text-align: center; /* Centrer horizontalement */
  vertical-align: middle; /* Centrer verticalement */
}
</style>
