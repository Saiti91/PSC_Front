<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "/src/components/HeaderAdmin.vue";
import FooterComponent from "/src/components/FooterComponent.vue";

const route = useRoute();
const apartmentId = ref(route.params.id);
const apartment = ref(null);
const error = ref(null);

const fetchApartmentDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/apartments/${apartmentId.value}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    apartment.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchApartmentDetails);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <h1 class="ui header">Détails de l'Appartement</h1>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else-if="apartment">
        <div class="ui segment">
          <h2 class="ui header">{{ apartment.street }} {{ apartment.number }}, {{ apartment.ville }}</h2>
          <p><strong>Date de Création:</strong> {{ new Date(apartment.created_at).toLocaleDateString() }}</p>
          <p><strong>Surface:</strong> {{ apartment.surface }} m²</p>
          <p><strong>Capacité:</strong> {{ apartment.capacity }} personnes</p>
          <p><strong>Disponible:</strong> {{ apartment.available ? 'Oui' : 'Non' }}</p>
          <p><strong>Type:</strong> {{ apartment.apartmentstype }}</p>
          <p><strong>Jardin:</strong> {{ apartment.garden ? 'Oui' : 'Non' }}</p>
          <p><strong>Nombre de Pièces:</strong> {{ apartment.roomnumber }}</p>
          <p><strong>Piscine:</strong> {{ apartment.pool ? 'Oui' : 'Non' }}</p>
          <p><strong>Prix:</strong> {{ apartment.price }} €</p>
          <p><strong>Email Propriétaire:</strong> {{ apartment.owner_email }}</p>
          <p><strong>Complément d'adresse:</strong> {{ apartment.addresscomplement }}</p>
          <p><strong>Bâtiment:</strong> {{ apartment.building }}</p>
          <p><strong>Numéro d'Appartement:</strong> {{ apartment.apartmentnumber }}</p>
          <p><strong>Code Postal:</strong> {{ apartment.cp }}</p>
        </div>
      </div>
      <div v-else class="ui active inline loader"></div>
    </div>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.container {
  max-width: 800px;
  margin-top: 50px;
}

.ui.segment {
  margin-top: 20px;
}
</style>
