<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import Cookies from "js-cookie";
import VueJwtDecode from 'vue-jwt-decode';
import Swal from "sweetalert2";

const token = Cookies.get('token');

//Modifier la fonction :
// - faire en sorte de ne récupérer que les réservation passer le ce user
// - trier pour n'avoir que les réservations passées
const fetchUserBookings = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  console.log(decodedToken)
  const userId = parseInt(decodedToken.uid,10)
  try {
    const response = await axiosInstance.get(`/reservations/users/${userId}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    user.value = response.data;
    console.log(response.data)
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
          <div class="ui stackable four column grid">
            <div class="column" v-for="reservations in displayedReservations" :key="reservations.reservationsid">
              <router-link :to="`/housing/${apartment.apartments_id}`" class="ui card">
                <div class="ui card">
                  <div class="image">
                    <img src="" alt="Image de {{ apartment.name }}">
                  </div>
                  <div class="content">
                    <a class="header">{{ apartment.name }}</a>
                    <div class="meta">
                      <span class="location">{{ apartment.town }}</span>
                    </div>
                    <div class="extra content">
                      <!-- étoiles
                      <div class="ui star rating" :data-rating="property.stars" data-max-rating="5"></div> -->
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
