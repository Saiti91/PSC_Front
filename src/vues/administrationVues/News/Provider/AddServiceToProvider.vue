<!-- AddServiceToProvider.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const providers = ref([]);
const serviceTypes = ref([]);
const selectedProviderId = ref(null);
const newService = ref({ serviceType_id: null, price: 0 });

const fetchProviders = async () => {
  const response = await axios.get('/servicesProviders');
  providers.value = response.data;
};

const fetchServiceTypes = async () => {
  const response = await axios.get('/services/type');
  serviceTypes.value = response.data;
};

const addServiceToProvider = async () => {
  await axios.post(`/services/provider/${selectedProviderId.value}/service`, {
    serviceType_id: newService.value.serviceType_id,
    price: newService.value.price
  });
};

onMounted(() => {
  fetchProviders();
  fetchServiceTypes();
});
</script>

<template>
  <div class="ui container">
    <h2 class="ui header">Ajouter des services à une entreprise existante</h2>
    <form class="ui form" @submit.prevent="addServiceToProvider">
      <div class="field">
        <label>Sélectionner une entreprise</label>
        <select v-model="selectedProviderId" required>
          <option v-for="provider in providers" :key="provider.servicesProviders_id" :value="provider.servicesProviders_id">
            {{ provider.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Type de Service</label>
        <select v-model="newService.serviceType_id" required>
          <option v-for="type in serviceTypes" :key="type.serviceTypes_id" :value="type.serviceTypes_id">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Prix</label>
        <input type="number" v-model="newService.price" required />
      </div>
      <button type="submit" class="ui button primary">Ajouter Service</button>
    </form>
  </div>
</template>

<style scoped>
.ui.container {
  margin-top: 2rem;
}
</style>
