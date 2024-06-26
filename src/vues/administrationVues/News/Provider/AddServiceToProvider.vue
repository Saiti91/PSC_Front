<script setup>
import { ref, onMounted } from 'vue';
import axios from '/src/utils/Axios.js';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import SuccessModalComponent from '/src/components/SuccessModal.vue';

const providers = ref([]);
const serviceTypes = ref([]);
const selectedProviderId = ref(null);
const newService = ref({ serviceType_id: null, price: 0 });

const error = ref(null);
const showModal = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successDetails = ref({});

const fetchProviders = async () => {
  try {
    const response = await axios.get('/services');
    providers.value = response.data;
  } catch (err) {
    console.error('Error fetching providers:', err);
  }
};

const fetchServiceTypes = async () => {
  try {
    const response = await axios.get('/services/type');
    serviceTypes.value = response.data;
  } catch (err) {
    console.error('Error fetching service types:', err);
  }
};

const addServiceToProvider = async () => {
  error.value = null; // Clear previous error message
  try {
    console.log('Submitting form with:', {
      provider_id: selectedProviderId.value,
      serviceType_id: newService.value.serviceType_id,
      price: newService.value.price
    });

    const response = await axios.post(`/services/provider/${selectedProviderId.value}/service`, {
      provider_id: selectedProviderId.value,
      serviceType_id: newService.value.serviceType_id,
      price: newService.value.price
    });

    console.log('Service added successfully');

    successTitle.value = 'Service ajouté avec succès';
    successMessage.value = "Le service a été ajouté à l'entreprise avec succès.";
    successDetails.value = response.data;
    showModal.value = true;

  } catch (err) {
    console.error('Error adding service to provider:', err);
    if (err.response && err.response.data && err.response.data.error) {
      error.value = err.response.data.error;
    } else {
      error.value = 'An error occurred while adding the service';
    }
  }
};

onMounted(() => {
  fetchProviders();
  fetchServiceTypes();
});
</script>

<template>
  <div class="ui container">
    <HeaderComponent/>
    <h2 class="ui header">Ajouter des services à une entreprise existante</h2>
    <form class="ui form" @submit.prevent="addServiceToProvider">
      <div class="field">
        <label>Sélectionner une entreprise</label>
        <select v-model="selectedProviderId" required>
          <option v-for="provider in providers" :key="provider.servicesproviders_id" :value="provider.servicesproviders_id">
            {{ provider.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Type de Service</label>
        <select v-model="newService.serviceType_id" required>
          <option v-for="type in serviceTypes" :key="type.servicetypes_id" :value="type.servicetypes_id">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Prix</label>
        <input type="number" v-model="newService.price" required />
      </div>
      <button type="submit" class="ui button primary">Ajouter Service</button>
      <div v-if="error" class="ui red message">{{ error }}</div>
    </form>
    <FooterComponent/>
    <SuccessModalComponent
        :show="showModal"
        :title="successTitle"
        :message="successMessage"
        :details="successDetails"
        @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.ui.container {
  margin-top: 2rem;
}
</style>
