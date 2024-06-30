<script setup>
import { useRoute, useRouter } from 'vue-router';
import HeaderComponent from '../../../components/HeaderComponent.vue';
import FooterComponent from '../../../components/FooterComponent.vue';

const route = useRoute();
const router = useRouter();

const reservationDetails = ref({
  apartment_id: route.query.apartment_id,
  startDate: route.query.startDate,
  endDate: route.query.endDate,
  guests: route.query.guests,
  services: route.query.services ? route.query.services.split(',') : []
});

const goToPayment = () => {
  router.push({
    name: 'PaymentPage',
    query: {
      apartment_id: reservationDetails.value.apartment_id,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      services: reservationDetails.value.services.join(',')
    }
  });
};

const goBack = () => {
  router.push({
    name: 'OrderSummary',
    query: {
      apartment_id: reservationDetails.value.apartment_id,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests,
      services: reservationDetails.value.services.join(',')
    }
  });
};
</script>

<template>
  <div class="booking-confirmation">
    <HeaderComponent />
    <div class="spacer"></div>
    <div class="container">
      <h1>Confirmation de réservation</h1>
      <div class="reservation-details">
        <h2>Détails de la réservation</h2>
        <p>Appartement ID: {{ reservationDetails.apartment_id }}</p>
        <p>Date de début: {{ reservationDetails.startDate }}</p>
        <p>Date de fin: {{ reservationDetails.endDate }}</p>
        <p>Nombre de personnes: {{ reservationDetails.guests }}</p>
        <div v-if="reservationDetails.services.length">
          <h3>Services sélectionnés:</h3>
          <ul>
            <li v-for="service in reservationDetails.services" :key="service">{{ service }}</li>
          </ul>
        </div>
      </div>
      <button @click="goBack">Modifier la réservation</button>
      <button @click="goToPayment">Procéder au paiement</button>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.booking-confirmation {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.reservation-details {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
