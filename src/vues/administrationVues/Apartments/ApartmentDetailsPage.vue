<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "/src/components/HeaderAdmin.vue";
import FooterComponent from "/src/components/FooterComponent.vue";
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import PhotoCarousel from '/src/components/PhotoCarousel.vue';

const route = useRoute();
const apartmentId = ref(route.params.id);
const apartments = ref({});
const error = ref(null);
const events = ref([]);

const parseStringArray = (stringArray) => {
  try {
    const cleanedString = stringArray.slice(1, -1);
    const parsedArray = cleanedString.split('","').map(str => {
      const relativePath = str.replace(/"/g, '').replace(/^D:\\\\Projet_PCS\\\\src\\\\assets\\\\housing\\\\6\\\\/, '/assets/housing/6/');
      return relativePath;
    });
    console.log('Parsed images:', parsedArray);
    return parsedArray;
  } catch (e) {
    console.error('Error parsing string array:', e);
    return [];
  }
};

const transformCalendarData = (calendar) => {
  return calendar.map(event => ({
    start: event.date,
    end: event.date,
    title: event.available ? 'true' : 'false'
  }));
};

const fetchApartmentDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/apartments/${apartmentId.value}/`);
    console.log(response.data);
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
      numberofroom: response.data.numberofroom,
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
      features: parseStringArray(response.data.features),
      description: response.data.description || '',
      rules: response.data.rules || '',
      calendar: response.data.calendar || []
    };
    events.value = transformCalendarData(apartments.value.calendar);
  } catch (err) {
    error.value = err.message;
  }
};

const handleCellClick = async (date) => {
  console.log('Cell clicked:', date);
  const clickedDate = date.toLocaleDateString('en-CA');
  console.log('Clicked Date:', clickedDate);

  let event = events.value.find(e => e.start === clickedDate);
  console.log('Event:', event);

  const requestData = {
    apartment_id: apartmentId.value,
    dates: [
      {
        date: clickedDate,
        available: event ? 'available' : 'unavailable'
      }
    ]
  };
  console.log("Sending PATCH request with data:", requestData);

  try {
    await axiosInstance.patch(`/apartmentsCalendar/availability/${apartmentId.value}/`, requestData);
    console.log(`Date: ${clickedDate}, Status: ${event ? 'available' : 'unavailable'}`);
    await fetchApartmentDetails(); // Rafraîchir les détails de l'appartement pour refléter le statut mis à jour
  } catch (err) {
    console.log(`Failed to update availability: ${err.message}`);
  }
};

onMounted(fetchApartmentDetails);
</script>

<template>
  <div class="ui container">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div v-if="error" class="ui negative message">
      <div class="header">Erreur</div>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="Object.keys(apartments).length" class="ui segment">
      <header class="ui header">
        <h1>{{ apartments.apartments_id }}</h1>
        <p>{{ apartments.street }}, {{ apartments.town }}</p>
      </header>

      <div class="ui divider"></div>

      <div class="ui two column stackable grid">
        <div class="column">
          <PhotoCarousel v-if="apartments.images && apartments.images.length" :photos="apartments.images"
                         class="ui medium images"/>
        </div>
        <div class="column">
          <div class="ui segment">
            <h2 class="ui header">Informations de base</h2>
            <p><strong>Prix :</strong> {{ apartments.price }}€</p>
            <p><strong>Surface :</strong> {{ apartments.surface }} m²</p>
            <p><strong>Nombre de chambres :</strong> {{ apartments.numberofroom }}</p>
            <p><strong>Disponibilité :</strong> {{ apartments.available }}</p>
          </div>
        </div>
      </div>

      <div class="ui segment">
        <h2 class="ui header">Description détaillée</h2>
        <p>{{ apartments.description }}</p>
        <h3 class="ui header">Équipements</h3>
        <ul class="ui list">
          <li v-for="amenity in apartments.features" :key="amenity">{{ amenity }}</li>
        </ul>
        <vue-cal
            :disable-views="['day','year','years','week']"
            :events="events"
            active-view="month"
            events-count-on-year-view
            xsmall
            @cell-click="handleCellClick">
        </vue-cal>
      </div>

      <div class="ui segment">
        <h2 class="ui header">Informations supplémentaires</h2>
        <p><strong>Règles de location :</strong> {{ apartments.rules }}</p>
        <p><strong>Conditions de paiement :</strong></p>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style>
.spacer {
  margin-top: 7%;
}

.ui.container {
  max-width: 800px;
}

.ui.segment {
  margin-top: 20px;
}
</style>
