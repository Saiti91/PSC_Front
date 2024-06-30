<script setup>
import HeaderComponent from '../../../components/HeaderComponent.vue';
import FooterComponent from '../../../components/FooterComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosInstance from "@/utils/Axios.js";

const router = useRouter();
const route = useRoute();

const reservationDetails = ref({
  apartmentId: route.query.apartmentId,
  startDate: route.query.startDate,
  endDate: route.query.endDate,
  guests: route.query.guests,
  town: route.query.town
});

const services = ref([]);
const selectedServices = ref([]);
const totalPrice = ref(0);

// Récupération des services disponibles
const fetchServices = async () => {
  try {
    const response = await axiosInstance.get(`/services?city=${reservationDetails.value.town}`);
    services.value = response.data.services;
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
  }
};

// Calculer le prix total
const calculateTotalPrice = () => {
  let basePrice = 100; // Exemple de prix de base de la réservation (à adapter)
  selectedServices.value.forEach(service => {
    basePrice += service.price;
  });
  totalPrice.value = basePrice;
};

// Gérer la sélection des services
const toggleService = (service) => {
  const index = selectedServices.value.findIndex(s => s.id === service.id);
  if (index !== -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(service);
  }
  calculateTotalPrice();
};

// Rediriger vers la page de confirmation
const confirmBooking = () => {
  router.push({
    name: 'BookingConfirmation',
    query: {
      apartmentId: reservationDetails.value.apartmentId,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests,
      services: selectedServices.value.map(service => service.id).join(',')
    }
  });
};

// Rediriger vers la page précédente
const goBack = () => {
  router.push({
    name: 'HousingDetails',
    params: {id: reservationDetails.value.apartmentId},
    query: {
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests,
      services: selectedServices.value.map(service => service.id).join(',')
    }
  });
};

// Rediriger vers la page de paiement
const goToPayment = () => {
  router.push({
    name: 'Payment',
    query: {
      apartmentId: reservationDetails.value.apartmentId,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests,
      services: selectedServices.value.map(service => service.id).join(',')
    }
  });
};

onMounted(() => {
  fetchServices();
  calculateTotalPrice();
});
</script>

<template>
  <div class="order-summary">
    <HeaderComponent/>
    <div class="container">
      <h1>Résumé de la commande</h1>
      <div class="reservation-details">
        <h2>Détails de la réservation</h2>
        <p>Date de début: {{ reservationDetails.startDate }}</p>
        <p>Date de fin: {{ reservationDetails.endDate }}</p>
        <p>Nombre de personnes: {{ reservationDetails.guests }}</p>
      </div>

      <div class="services">
        <h2>Services disponibles</h2>
        <ul>
          <li v-for="service in services" :key="service.id">
            <label>
              <input type="checkbox" :value="service" @change="toggleService(service)">
              {{ service.name }} - {{ service.price }}€
            </label>
          </li>
        </ul>
      </div>

      <div class="total-price">
        <h2>Prix total: {{ totalPrice }}€</h2>
        <button @click="confirmBooking">Confirmer la réservation</button>
        <button @click="goBack">Modifier la réservation</button>
        <button @click="goToPayment">Procéder au paiement</button>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.order-summary {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.reservation-details, .services, .total-price {
  margin-bottom: 20px;
}

.total-price {
  font-size: 1.5em;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  margin: 10px;
  background-color: #21ba45;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
