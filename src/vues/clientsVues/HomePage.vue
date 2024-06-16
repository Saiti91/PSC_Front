<!-- MainComponent.vue -->
<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";

const apartments = ref([]);
const error = ref(null);

const parseStringArray = (stringArray) => {
  return stringArray ? stringArray.replace(/{|}/g, '').split(',') : [];
};

const fetchApartments = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/apartments/carousel');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchedApartments = response.data.map(apartment => ({
      apartments_id: apartment.apartments_id,
      name: apartment.name,
      town: apartment.town,
      images: parseStringArray(apartment.images),
    }));

    // Carte "Voir tous nos biens" à la fin
    fetchedApartments.push({
      apartments_id: 'view-all',
      name: 'Voir tous nos biens',
      town: '',
      images: ['/src/assets/image_right_arrow.jpg']
    });

    console.log("Fetched Apartments: ", fetchedApartments);
    apartments.value = fetchedApartments;
  } catch (err) {
    error.value = err.message;
  }
};


onMounted(fetchApartments);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <HeaderComponent />
    <div class="spacer"></div>
    <router-link to="/housing">
      <h2 class="clickable-title">{{ $t('our-housing') }}</h2>
    </router-link>
    <div v-if="error">{{ error }}</div>
    <div v-else-if="apartments.length === 0">Aucun appartement trouvé.</div>
    <div class="carousel-wrapper">
      <div class="carousel-container">
        <div class="item" v-for="apartment in apartments" :key="apartment.apartments_id">
          <div class="ui special cards">
            <div class="card">
              <div class="blurring dimmable image">
                <div class="ui dimmer">
                  <div class="content">
                    <div class="center">
                      <div class="ui inverted button">{{ $t('housing-details') }}</div>
                    </div>
                  </div>
                </div>
                <img src="" alt="Image de {{ apartment.name }}">
              </div>
              <div class="content">
                <a class="header">{{ apartment.name }}</a>
                <div class="meta">
                  <span class="address">{{ apartment.town }}</span>
                </div>
              </div>
              <div class="extra content">
                <a>
                  <!--nombre d'étoiles-->
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.full-width {
  width: 100% !important;
}

.spacer {
  margin-top: 7%;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden; /* Hide scrollbars */
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden; /* Hide vertical scrollbar */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* For smooth scrolling on mobile */
  gap: 10px; /* Space between cards */
  padding: 10px; /* Padding around the carousel */
}

.carousel-container .item {
  flex: 0 0 auto; /* Prevent shrinking */
  display: flex; /* Ensure content inside item is displayed correctly */
}

.ui.special.cards {
  width: 250px; /* Width of each card */
}

.scroll-button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left {
  position: absolute;
  left: -40px;
}

.scroll-button.right {
  position: absolute;
  right: -40px;
}

.ui.footer .list {
  color: #ccc !important;
}
</style>
