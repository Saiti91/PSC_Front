<script setup>
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";

const route = useRoute();
const router = useRouter();
const apartments = ref({});
const apartment_id = ref(route.params.id);
const error = ref(null);
const selectedImage = ref(null);
const guests = ref('');
const showError = ref(false);
const startDate = ref('');
const endDate = ref('');
const dateError = ref(false);
const startDateError = ref(false);
const endDateError = ref(false);
const availabilityError = ref(false);
const capacityError = ref(false);

const parseStringArray = (stringArray) => {
  return stringArray.replace(/{|}/g, '').split(',');
};

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
      images: response.data.images ? parseStringArray(response.data.images) : [],
      features: response.data.features ? parseStringArray(response.data.features) : []
    };
    console.log('Fetched apartment:', apartments.value)
  } catch (err) {
    error.value = err.message;
  }
};

const selectImage = (image) => {
  selectedImage.value = image;
};

const checkAvailability = async () => {
  try {
    const response = await axiosInstance.post('/apartments/availabilities', {
      start_date: startDate.value,
      end_date: endDate.value,
      apartment_id: apartment_id.value
    });
    console.log('Availability response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error checking availability:', err);
    return false;
  }
};

const handleReservation = async () => {
  showError.value = false;
  dateError.value = false;
  startDateError.value = false;
  endDateError.value = false;
  availabilityError.value = false;
  capacityError.value = false;
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

  if (parseInt(guests.value) > apartments.value.capacity) {
    capacityError.value = true;
    showError.value = true;
    return;
  }

  const available = await checkAvailability();
  if (!available) {
    availabilityError.value = true;
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
          <img v-if="apartments.images && apartments.images.length" :src="selectedImage || apartments.images[0]"
               :alt="`Image de ${apartments.name}`">
        </div>
        <div class="image-thumbnails">
          <img v-for="(image, index) in apartments.images" :src="image"
               :alt="`Vignette de ${apartments.name} ${index + 1}`" :key="index" @click="selectImage(image)">
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
              <input type="date" id="start-date" v-model="startDate"
                     :class="{'error': showError && (startDateError || !startDate)}"/>
              <label for="end-date">À</label>
              <input type="date" id="end-date" v-model="endDate"
                     :class="{'error': showError && (endDateError || !endDate)}"/>
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
          <p v-if="availabilityError" class="error-message">Ces dates ne sont pas disponibles</p>
          <p v-if="capacityError" class="error-message">Le nombre de personnes dépasse la capacité maximale</p>
        </div>
      </div>
    </div>

    <!-- Caractéristique de l'appartement -->
    <div class="ui stackable grid">
      <div class="eight wide column">
        <div class="apartment-details">
          <h3>Caractéristiques de l'appartement</h3>
          <div class="ui list">
            <div class="item">
              <i class="building icon"></i>
              <div class="content">
                <div class="header">Type</div>
                <div class="description">{{ apartments.apartment_type }}</div>
              </div>
            </div>
            <div class="item">
              <i class="expand icon"></i>
              <div class="content">
                <div class="header">Surface</div>
                <div class="description">{{ apartments.surface }} m²</div>
              </div>
            </div>
            <div class="item">
              <i class="users icon"></i>
              <div class="content">
                <div class="header">Capacité</div>
                <div class="description">{{ apartments.capacity }} personnes</div>
              </div>
            </div>
            <div class="item">
              <i class="dollar sign icon"></i>
              <div class="content">
                <div class="header">Prix</div>
                <div class="description">{{ apartments.price }} €/nuit</div>
              </div>
            </div>
            <div class="item" v-if="apartments.features && apartments.features.length">
              <i class="check icon"></i>
              <div class="content">
                <div class="header">Caractéristiques</div>
                <div class="description">
                  <ul>
                    <li v-for="feature in apartments.features" :key="feature">{{ feature }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Adresse de l'appartement -->
      <div class="eight wide column">
        <h3>Adresse</h3>
        <div class="ui list">
          <div class="item">
            <i class="home icon"></i>
            <div class="content">
              <div class="header">Rue</div>
              <div class="description">{{ apartments.number}} rue {{ apartments.street }}</div>
              <div class="description" v-if="apartments.addressComplement">{{ apartments.addressComplement }}</div>
            </div>
          </div>
          <div class="item" v-if="apartments.building">
            <i class="building icon"></i>
            <div class="content">
              <div class="header">Bâtiment</div>
              <div class="description">{{ apartments.building }}</div>
            </div>
          </div>
          <div class="item" v-if="apartments.apartmentNumber">
            <i class="numbered list icon"></i>
            <div class="content">
              <div class="header">Numéro d'appartement</div>
              <div class="description">{{ apartments.apartmentNumber }}</div>
            </div>
          </div>
          <div class="item">
            <i class="marker icon"></i>
            <div class="content">
              <div class="header">Ville</div>
              <div class="description">{{ apartments.CP }} {{ apartments.town }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
    <!-- Fin de la nouvelle section -->

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

.apartment-details {
  margin-top: 20px;
}

.apartment-details .ui.list .item .header {
  font-weight: bold;
}

.apartment-details .ui.list .item .description {
  margin-top: 5px;
}
</style>