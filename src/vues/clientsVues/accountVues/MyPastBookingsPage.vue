<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";
import Cookies from "js-cookie";
import VueJwtDecode from 'vue-jwt-decode';
import Swal from "sweetalert2";

const token = Cookies.get('token');
const error = ref(null);
const user = ref([]);

const fetchUserBookings = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  const userId = parseInt(decodedToken.uid, 10);

  try {
    const response = await axiosInstance.get(`/reservations/users/${userId}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allReservations = response.data;
    const pastReservations = allReservations.filter(reservation => new Date(reservation.endDate) < new Date());
    user.value = pastReservations;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchUserBookings)
</script>

<template>
  <div>
    <HeaderComponent />
    <div class="account-container">
      <AccountMenuComponent />
      <div class="content-container">
        <div class="content">
          <h2>{{ $t('my-past-bookings') }}</h2>
          <div v-if="error" class="ui negative message">{{ error }}</div>
          <div v-else class="ui stackable four column grid">
            <div class="column" v-for="reservation in user" :key="reservation.reservationId">
              <router-link :to="`/housing/${reservation.apartmentId}`" class="ui card">
                <div class="ui card">
                  <div class="image">
                    <img :src="reservation.apartmentImage" :alt="`Image de ${reservation.apartmentName}`">
                  </div>
                  <div class="content">
                    <a class="header">{{ reservation.apartmentName }}</a>
                    <div class="meta">
                      <span class="location">{{ reservation.apartmentTown }}</span>
                    </div>
                    <div class="extra content">
                      <!-- étoiles -->
                      <div class="ui star rating" :data-rating="reservation.stars" data-max-rating="5"></div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
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
