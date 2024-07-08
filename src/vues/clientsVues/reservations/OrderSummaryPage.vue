<script setup>
import HeaderComponent from '../../../components/HeaderComponent.vue';
import FooterComponent from '../../../components/FooterComponent.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from "@/utils/Axios.js";

const router = useRouter();
const route = useRoute();

const reservationDetails = ref({
  apartment_id: route.query.apartment_id,
  startDate: route.query.startDate,
  endDate: route.query.endDate,
  price: parseFloat(route.query.price),
  guests: route.query.guests,
  town: route.query.town,
  services: [],
  totalPrice: '0.00'
});

const services = ref([]);
const selectedServices = ref([]);
const totalPrice = ref(0);

const fetchServices = async () => {
  try {
    const response = await axiosInstance.get(`/services/appartements/${reservationDetails.value.apartment_id}/services`);
    services.value = response.data;
    console.log('Services récupérés:', response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
  }
};

const calculateTotalPrice = () => {
  let basePrice = reservationDetails.value.price || 0;
  selectedServices.value.forEach(service => {
    if (service.price) {
      basePrice += parseFloat(service.price);
    }
  });
  totalPrice.value = basePrice.toFixed(2);
  reservationDetails.value.totalPrice = totalPrice.value;
};

const toggleService = (service) => {
  const index = selectedServices.value.findIndex(s => s.servicesproviders_id === service.servicesproviders_id && s.serviceType_id === service.services[0]?.serviceType_id);
  if (index !== -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push({
      servicesproviders_id: service.servicesproviders_id,
      serviceType_id: service.services[0]?.serviceType_id,
      price: service.services[0]?.price
    });
  }
  reservationDetails.value.services = [...selectedServices.value];
  calculateTotalPrice();
};

const goBack = () => {
  router.push({
    name: 'HousingDetails',
    params: { id: reservationDetails.value.apartment_id },
    query: {
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
      guests: reservationDetails.value.guests
    }
  });
};

const goToPayment = () => {
  const reservationData = {
    ...reservationDetails.value,
    services: selectedServices.value,
    totalPrice: totalPrice.value
  };
  localStorage.setItem('reservationDetails', JSON.stringify(reservationData));
  console.log('Données de réservation:', reservationData);
  router.push({
    name: 'Payment',
    query: {
      apartment_id: reservationDetails.value.apartment_id,
      startDate: reservationDetails.value.startDate,
      endDate: reservationDetails.value.endDate,
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
    <h1 class="ui header">Résumé de la commande</h1>
    <div class="ui segment">
      <h2 class="ui header">Détails de la réservation</h2>
      <p>Date de début: {{ reservationDetails.startDate }}</p>
      <p>Date de fin: {{ reservationDetails.endDate }}</p>
      <p>Nombre de personnes: {{ reservationDetails.guests }}</p>
    </div>
    <div class="ui segment">
      <h2 class="ui header">Services disponibles</h2>
      <div class="ui list">
        <div v-for="service in services" :key="service.servicesproviders_id" class="item">
          <div class="ui checkbox">
            <input
                type="checkbox"
                :value="service"
                @change="toggleService(service)">
            <label>{{ service.provider_name }} - {{ service.services[0]?.serviceType_name }} -
              {{ service.services[0]?.price }}€</label>
          </div>
        </div>
      </div>
    </div>
    <div class="ui segment">
      <h2 class="ui header">Prix total: {{ totalPrice }}€</h2>
      <button class="ui button" @click="goBack">Modifier la réservation</button>
      <button class="ui primary button" @click="confirmAndPay">Confirmer et payer</button>
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
  margin-bottom: 20px;
}

.ui.header {
  margin-bottom: 10px;
}

button.ui.button {
  margin-top: 10px;
}
</style>
