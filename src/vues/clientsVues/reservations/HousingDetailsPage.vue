<script setup>
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";

const route = useRoute();
const apartments = ref({});
const apartment_id = ref(route.params.id);
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

// Function to parse string arrays
const parseStringArray = (stringArray) => {
  return stringArray.replace(/{|}/g, '').split(',');
};

// Fetch apartment details
const fetchApartmentDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/apartments/${apartment_id.value}/`);
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
      images: parseStringArray(response.data.images),
      features: parseStringArray(response.data.features)
    };
  } catch (err) {
    error.value = err.message;
  }
};

// Function to select main image
const selectImage = (image) => {
  selectedImage.value = image;
};

// Function to handle reservation
const handleReservation = () => {
  showError.value = false;

  // Validate dates
  dateError.value = false;
  startDateError.value = false;
  endDateError.value = false;
  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate.value).setHours(0, 0, 0, 0);
  const end = new Date(endDate.value).setHours(0, 0, 0, 0);

  if (!startDate.value || !endDate.value || !guests.value) {
    showError.value = true;
    return;
  }

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

  router.push({
    name: 'OrderSummary',
    query: {
      apartment_id: apartment_id.value,
      startDate: startDate.value,
      endDate: endDate.value,
      guests: guests.value,
      price: parseFloat(apartments.value.price),
      town: apartments.value.town
    }
  });
};

onMounted(fetchApartmentDetails);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui stackable grid">
      <div class="eight wide column">
        <div class="main-image">
          <img v-if="apartments.images && apartments.images.length" :src="selectedImage || apartments.images[0]" :alt="`Image de ${apartments.name}`">
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
        <div class="reservation">
          <div class="ui form">
            <div class="field">
              <h3>Réservation</h3>
              <label for="start-date">De</label>
              <input type="date" id="start-date" v-model="startDate" :class="{'error': showError && (startDateError || !startDate)}"/>
              <label for="end-date">À</label>
              <input type="date" id="end-date" v-model="endDate" :class="{'error': showError && (endDateError || !endDate)}"/>
            </div>
            <div class="field">
              <label for="guests">Nombre de personnes</label>
              <input type="number" id="guests" v-model="guests" :class="{'error': showError && !guests}" min="1"/>
            </div>
            <button class="ui primary button" @click="handleReservation">Réserver maintenant</button>
          </div>
          <p v-if="showError && (!startDate || !endDate || !guests)" class="error-message">Veuillez remplir tous les
            champs obligatoires</p>
          <p v-if="dateError" class="error-message">Dates invalides</p>
        </div>
      </div>
    </div>
    <FooterComponent/>
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
