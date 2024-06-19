<script setup>
import { ref, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import SuccessModalComponent from '/src/components/SuccessModal.vue';
import 'semantic-ui-css/semantic.min.css';

const form = ref({
  name: '',  // Changer serviceName en name
  selectedFeatures: []
});

const originalFormData = JSON.parse(JSON.stringify(form.value)); // Clone original form data for resetting
const error = ref(null);
const featuresOptions = ref([]); // Holds the available features from the API
const showModal = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successDetails = ref({}); // Holds the success details

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(originalFormData)); // Reset form to original values
};

const fetchFeatures = async () => {
  try {
    const response = await axiosInstance.get('/apartments/apartmentFeatures');
    featuresOptions.value = response.data;
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

const submitForm = async () => {
  error.value = null; // Clear previous error message
  try {
    console.log('Name: ', form.value.name);  // Changer serviceName en name
    console.log('Selected features: ', form.value.selectedFeatures);
    const response = await axiosInstance.post('/services/type', {
      name: form.value.name,  // Changer serviceName en name
      features: form.value.selectedFeatures
    });
    // Set success modal details
    successTitle.value = 'Création réussie';
    successMessage.value = 'Le type de service a été créé avec succès.';
    successDetails.value = response.data;
    showModal.value = true;

    // Réinitialiser le formulaire
    resetForm();
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

// Fetch features on component mount
onMounted(fetchFeatures);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <form class="ui form" @submit.prevent="submitForm">
      <div class="field">
        <label>Nom du Service</label>
        <input type="text" v-model="form.name" required/>  <!-- Changer serviceName en name -->
      </div>
      <div class="field">
        <label>Features</label>
        <div v-for="feature in featuresOptions" :key="feature.id" class="ui checkbox">
          <input type="checkbox" :value="feature.name" v-model="form.selectedFeatures">
          <label>{{ feature.name }}</label>
        </div>
      </div>
      <button class="ui button" type="submit">Submit</button>
      <div v-if="error" class="ui red message">
        {{ error }}
      </div>
    </form>
    <div class="spacer"></div>
    <FooterComponent/>

    <SuccessModalComponent
        :show="showModal"
        :title="successTitle"
        :message="successMessage"
        :details="successDetails"
        @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.checkbox {
  display: block;
  margin-bottom: 10px;
}
</style>
