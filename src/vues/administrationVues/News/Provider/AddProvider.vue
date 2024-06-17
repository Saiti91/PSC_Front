<!-- AddProvider.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const serviceTypes = ref([]);
const newProvider = ref({
  name: '',
  telephone: '',
  address: '',
  services: [{ serviceType_id: null, price: 0 }]
});

const fetchServiceTypes = async () => {
  const response = await axios.get('/services/type');
  serviceTypes.value = response.data;
};

const addServiceField = () => {
  newProvider.value.services.push({ serviceType_id: null, price: 0 });
};

const addNewProviderAndServices = async () => {
  await axios.post('/services/provider', {
    name: newProvider.value.name,
    telephone: newProvider.value.telephone,
    address: newProvider.value.address,
    services: newProvider.value.services
  });
};

onMounted(() => {
  fetchServiceTypes();
});
</script>

<template>
  <div class="ui container">
    <h2 class="ui header">Ajouter une nouvelle entreprise et ses services</h2>
    <form class="ui form" @submit.prevent="addNewProviderAndServices">
      <div class="field">
        <label>Nom de l'entreprise</label>
        <input type="text" v-model="newProvider.name" required />
      </div>
      <div class="field">
        <label>Téléphone</label>
        <input type="text" v-model="newProvider.telephone" required />
      </div>
      <div class="field">
        <label>Adresse</label>
        <input type="text" v-model="newProvider.address" required />
      </div>
      <div v-for="(service, index) in newProvider.services" :key="index" class="fields">
        <div class="eight wide field">
          <label>Type de Service</label>
          <select v-model="service.serviceType_id" required>
            <option v-for="type in serviceTypes" :key="type.serviceTypes_id" :value="type.serviceTypes_id">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="four wide field">
          <label>Prix</label>
          <input type="number" v-model="service.price" required />
        </div>
        <div class="four wide field" style="display: flex; align-items: center;">
          <button type="button" class="ui button red" @click="newProvider.services.splice(index, 1)">Supprimer</button>
        </div>
      </div>
      <button type="button" class="ui button" @click="addServiceField">Ajouter un service</button>
      <button type="submit" class="ui button primary">Ajouter Entreprise et Services</button>
    </form>
  </div>
</template>

<style scoped>
.ui.container {
  margin-top: 2rem;
}
</style>
