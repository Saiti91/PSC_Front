<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "/src/components/HeaderAdmin.vue";
import FooterComponent from "/src/components/FooterComponent.vue";
//import PhotoCarousel from "/src/components/PhotoCarousel.vue";  // Assurez-vous d'importer le composant du carrousel de photos

const route = useRoute();
const apartmentId = ref(route.params.id);
const apartments = ref({});
const error = ref(null);


const parseStringArray = (stringArray) => {
  // Removing the curly braces and splitting by comma
  return stringArray.replace(/{|}/g, '').split(',');
};


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
      images: parseStringArray(response.data.images),  // Assurez-vous que les images sont disponibles ici
      features: parseStringArray(response.data.features)
    };
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchApartmentDetails);
</script>

<template>
  <div class="ui container">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui segment">
      <header class="ui header">
        <h1>{{ apartments.apartments_id }}</h1>
        <p>{{ apartments.street }}, {{ apartments.town }}</p>
      </header>

      <div class="ui divider"></div>

      <div class="ui two column stackable grid">
        <div class="column">
          <PhotoCarousel :photos="apartments.images" class="ui medium images"/>
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

<style scoped>
.spacer {
  margin-top: 7%;
}
.ui.container {
  max-width: 800px;
  margin-top: 50px;
}

.ui.segment {
  margin-top: 20px;
}
</style>
