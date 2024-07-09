<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";
import Cookies from "js-cookie";
import VueJwtDecode from 'vue-jwt-decode';

const token = Cookies.get('token');
const error = ref(null);
const reservations = ref([]);
const noReservations = ref(false);

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const fetchUserBookings = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  const userId = parseInt(decodedToken.uid, 10);

  try {
    console.log(`Fetching reservations for user ID: ${userId}`);
    const response = await axiosInstance.get(`/reservations/users/${userId}/`);
    console.log('Response status:', response.status);
    if (response.status === 404) {
      noReservations.value = true;
      return;
    }
    const allReservations = response.data;
    const pastReservations = allReservations.filter(reservation => new Date(reservation.date_start) < new Date());
    reservations.value = pastReservations;
    if (reservations.value.length === 0) {
      noReservations.value = true;
    }
    for (const reservation of reservations.value) {
      const apartmentId = reservation.apartment_id;
      try {
        const responseApartement = await axiosInstance.get(`/apartments/${apartmentId}/`);
        reservation.apartmentDetails = responseApartement.data; // Ajouter les détails de l'appartement à la réservation
        console.log(reservation.apartmentDetails);
      } catch (err) {
        console.error(`Error fetching apartment details for apartment ID ${apartmentId}:`, err);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      noReservations.value = true;
    } else {
      error.value = err.message;
    }
    console.error("Error fetching reservations:", err);
  }
};

onMounted(fetchUserBookings);
</script>

<template>
  <div>
    <HeaderComponent/>
    <div class="account-container">
      <AccountMenuComponent/>
      <div class="content-container">
        <div class="content">
          <h2>{{ $t('my-past-bookings') }}</h2>
          <div v-if="error" class="ui negative message">{{ error }}</div>
          <div v-else-if="noReservations" class="ui message">Pas de réservation</div>
          <div v-else class="ui stackable four column grid">
            <div class="column" v-for="reservation in reservations" :key="reservation.reservation_id">
              <div class="ui card">
                <div class="image">
                  <img :src="reservation.apartmentDetails.image" :alt="`Image de ${reservation.apartmentDetails.name}`">
                </div>
                <div class="content">
                  <a class="header">{{ reservation.apartmentDetails.name }}</a>
                  <div class="meta">
                    <span class="location">{{ reservation.apartmentDetails.town }}</span>
                  </div>
                  <div class="extra content">
                    <div>{{  formatDate(reservation.date_start) }}</div>
                    <div>{{  formatDate(reservation.date_end) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  margin-top: 5%;
}

.content-container {
  flex: 1;
  padding: 20px;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 15px;
}

footer {
  margin-top: auto;
}
</style>
