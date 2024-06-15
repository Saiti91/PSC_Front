<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";

const apartment = ref(null);
const error = ref(null);
const route = useRoute();

const fetchApartmentDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/apartments/${route.params.id}`);
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
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <div v-if="apartment" class="ui centered card">
      <div class="image">
        <img :src="apartment.images[0] || '/src/assets/housing/moutain_chalet.jpg'" :alt="`Image de ${apartment.name}`">
      </div>
      <div class="content">
        <h2 class="header">{{ apartment.name }}</h2>
        <div class="meta">
          <span class="location">{{ apartment.town }}</span>
        </div>
        <div class="description">
          <p>{{ apartment.description }}</p>
        </div>
      </div>
      <div class="extra content">
        <!-- étoiles
        <div class="ui star rating" :data-rating="apartment.stars" data-max-rating="5"></div>
        -->
      </div>
    </div>
    <div v-else class="ui active centered inline loader"></div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 9%;
}
.ui.card {
  width: 100%;
}
</style>