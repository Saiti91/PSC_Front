<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";

const apartments = ref([]); //tous les apparts
const error = ref(null);
const displayedApartments = ref([]);  // appart affichés
const displayedCount = ref(12);       // Nd appart a afficher

const parseStringArray = (stringArray) => {
  return stringArray ? stringArray.replace(/{|}/g, '').split(',') : [];
};

const fetchApartments = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/apartments');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Fetched Apartments: ", response.data);
    apartments.value = response.data.map(apartment => ({
      apartments_id: apartment.apartments_id,
      name: apartment.name,
      town: apartment.town,
      addresscomplement: apartment.addresscomplement,
      apartment_type: apartment.apartment_type,
      apartmentnumber: apartment.apartmentnumber,
      apartmentstype_id: apartment.apartmentstype_id,
      building: apartment.building,
      capacity: apartment.capacity,
      cp: apartment.cp,
      created_at: apartment.created_at,
      features: parseStringArray(apartment.features),
      images: parseStringArray(apartment.images),
      number: apartment.number,
      numberofroom: apartment.numberofroom,
      owner_email: apartment.owner_email,
      price: apartment.price,
      street: apartment.street,
      surface: apartment.surface,
    }));
    updateDisplayedApartments();
  } catch (err) {
    error.value = err.message;
  }
};

const updateDisplayedApartments = () => {
  displayedApartments.value = apartments.value.slice(0, displayedCount.value);
};

const loadMore = () => {
  displayedCount.value += 12;
  updateDisplayedApartments();
};

onMounted(fetchApartments);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui stackable four column grid">
      <div class="column" v-for="apartment in displayedApartments" :key="apartment.apartments_id">
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
    <div class="ui center aligned basic segment">
      <button class="ui button" @click="loadMore">{{ $t('load-more') }}</button>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 9%;
}

.ui.card {
  width: 100%; /* Assure que les cartes prennent toute la largeur de la colonne */
}

.ui.stackable.five.column.grid > .column {
  padding: 0.5rem; /* Espacement entre les colonnes */
}
</style>