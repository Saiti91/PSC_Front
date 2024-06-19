<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";

const route = useRoute();
const apartments = ref({});
const apartmentId = ref(route.params.id);
const error = ref(null);
const router = useRouter();
const selectedImage = ref(null);
const guests = ref('');
const showError = ref(false);
const startDate = ref('');
const endDate = ref('');
const dateError = ref(false);
const startDateError = ref(false);
const endDateError = ref(false);

//séparation des champs avec plusieurs infos
const parseStringArray = (stringArray) => {
  return stringArray.replace(/{|}/g, '').split(',');
};

//récupération des infos de l'appartement
const fetchApartmentDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/apartments/${apartmentId.value}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    apartments.value = {
      apartments_id: response.data.apartments_id,
      created_at: response.data.created_at.split('T')[0],
      surface: response.data.surface,
      capacity: response.data.capacity,
      available: response.data.available,
      apartment_type: response.data.apartment_type,
      //numberofroom: response.data.numberofroom,
      pool: response.data.pool,
      price: response.data.price,
      owner_email: response.data.owner_email,
      number: response.data.number,
      addressComplement: response.data.addressComplement,
      building: response.data.building,
      apartmentNumber: response.data.apartmentNumber,
      street: response.data.street,
      CP: response.data.CP,
      town: response.data.town,
      images: parseStringArray(response.data.images),  // Assurez-vous que les images sont disponibles ici
      features: parseStringArray(response.data.features)
    };
  } catch (err) {
    error.value = err.message;
  }
};

//choisi image principale
const selectImage = (image) => {
  selectedImage.value = image;
};

//formulaire de réservation
const handleReservation = () => {
  showError.value = false; //pour vérifier que tous les champs sont remplis

  //vérification des dates (date début avant date de fin et pas dans le passé
  dateError.value = false;
  startDateError.value = false;
  endDateError.value = false;
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate.value).setHours(0, 0, 0, 0);
  const end = new Date(endDate.value).setHours(0, 0, 0, 0);

  // Validation des champs requis
  if (!startDate.value || !endDate.value || !guests.value) {
    showError.value = true;
    return;
  }

  // Validation des dates
  let invalidDates = false;
  if (start >= end) {
    dateError.value = true;
    invalidDates = true;
  }
  if (start < today) {
    startDateError.value = true;
    invalidDates = true;
  }
  if (end < today) {
    endDateError.value = true;
    invalidDates = true;
  }
  if (invalidDates) {
    dateError.value = true;
    showError.value = true;
    return;
  }

  // Si tout est valide, rediriger vers une page de confirmation ou traiter la réservation
  router.push({ name: 'BookingConfirmation' });
};

onMounted(fetchApartmentDetails);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <div class="ui stackable grid">
      <div class="eight wide column">
        <div class="main-image">
          <img src="" :alt="`Image de ${apartments.name}`">
        </div>
        <div class="image-thumbnails">
          <img v-for="(image, index) in apartments.images" :src="image" :alt="`Vignette de ${apartments.name} ${index + 1}`" :key="index" @click="selectImage(image)">
        </div>
      </div>
      <div class="eight wide column">
        <h2>{{ apartments.name }}</h2>
        <div class="meta">
          <span class="location">{{ apartments.town }}</span>
        </div>
        <!--
        <div class="stars">
          <div class="ui star rating" :data-rating="apartments.stars" data-max-rating="5"></div>
        </div>
        -->
        <div class="reservation">
          <div class="ui form">
            <div class="field">
              <h3>{{$t('booking')}}</h3>
              <label for="start-date">{{$t('from')}}</label>
              <input type="date" id="start-date" v-model="startDate" :class="{'error': showError && (startDateError || !startDate)}" />
              <label for="end-date">{{$t('to')}}</label>
              <input type="date" id="end-date" v-model="endDate" :class="{'error': showError && (endDateError || !endDate)}" />
            </div>
            <div class="field">
              <label for="guests">{{ $t('nb-people') }}</label>
              <input type="number" id="guests" v-model="guests" :class="{'error': showError && !guests}" min="1" />
            </div>
            <button class="ui primary button" @click="handleReservation">{{ $t('book-now')}}</button>
          </div>
          <p v-if="showError && (!startDate || !endDate || !guests)" class="error-message">{{ $t('mandatory-fields') }}</p>
          <p v-if="dateError" class="error-message">{{ $t('invalid-dates') }}</p>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>


<style scoped>
.spacer {
  margin-top: 9%;
}

.main-image img {
  width: 100%;
  height: auto;
}

.image-thumbnails img {
  width: 80px;
  height: auto;
  margin-right: 10px;
  cursor: pointer;
  border: 2px solid transparent;
}

.image-thumbnails img:hover,
.image-thumbnails img.active {
  border: 2px solid #21BA45; /* Couleur verte de Semantic UI */
}

.error {
  border-color: red !important;
}

.error-message {
  color: red;
  margin-top: 5px;
}
</style>

