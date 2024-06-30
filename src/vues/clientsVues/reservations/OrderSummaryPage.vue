<script setup>
import HeaderComponent from '../../../components/HeaderComponent.vue';
import FooterComponent from '../../../components/FooterComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosInstance from "@/utils/Axios.js";

const router = useRouter();
const route = useRoute();

const reservationDetails = ref({
  apartment_id: route.query.apartment_id,
  startDate: route.query.startDate,
  endDate: route.query.endDate,
  guests: route.query.guests,
  town: route.query.town
});

const services = ref([]);
const selectedServices = ref([]);
const totalPrice = ref(0);

const fetchServices = async () => {
  try {
    const response = await axiosInstance.get(`/services?city=${reservationDetails.value.town}`);
    services.value = response.data.services;
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
  }
};

const calculateTotalPrice = () => {
  let basePrice = 100;
  //TODO: get base price from the apartment
  selectedServices.value.forEach(service => {
    basePrice += service.price;
  });
  totalPrice.value = basePrice;
};

const toggleService = (service) => {
  const index = selectedServices.value.findIndex(s => s.id === service.id);
  if (index !== -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(service);
  }
  calculateTotalPrice();
};

const goBack = () => {
  router.push({
    name: 'HousingDetails',
    params: {id: reservationDetails.value.apartment_id},
    query: {
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests,
      services: selectedServices.value.map(service => service.id).join(',')
    }
  });
};

const goToPayment = () => {
  router.push({
    name: 'Payment',
    query: {
      apartment_id: reservationDetails.value.apartment_id,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      services: selectedServices.value.map(service => service.id).join(','),
      totalPrice: totalPrice.value
    }
  });
};

const confirmAndPay = () => {
  goToPayment();
};

onMounted(() => {
  fetchServices();
  calculateTotalPrice();
});
</script>

<template>
  <div class="ui container order-summary">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui segment">
      <h1 class="ui header">Résumé de la commande</h1>
      <div class="ui grid">
        <div class="eight wide column">
          <h2 class="ui header">Détails de la réservation</h2>
          <p>Date de début: {{ reservationDetails.startDate }}</p>
          <p>Date de fin: {{ reservationDetails.endDate }}</p>
          <p>Nombre de personnes: {{ reservationDetails.guests }}</p>
        </div>
        <div class="eight wide column">
          <h2 class="ui header">Services disponibles</h2>
          <div class="ui list">
            <div class="item" v-for="service in services" :key="service.id">
              <div class="ui checkbox">
                <input type="checkbox" :value="service" @change="toggleService(service)">
                <label>{{ service.name }} - {{ service.price }}€</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui segment">
        <h2 class="ui header">Prix total: {{ totalPrice }}€</h2>
        <button class="ui button" @click="goBack">Modifier la réservation</button>
        <button class="ui primary button" @click="confirmAndPay">Confirmer et payer</button>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.order-summary {
  padding: 20px;
}

.ui.segment {
  padding: 20px;
}

.ui.grid {
  margin-bottom: 20px;
}

.ui.header {
  margin-bottom: 10px;
}

button.ui.button {
  margin-top: 10px;
}
</style>
