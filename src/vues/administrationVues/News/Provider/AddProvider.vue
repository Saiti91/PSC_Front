<script setup>
import {onMounted, reactive, ref} from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import SuccessModalComponent from '/src/components/SuccessModal.vue';
import 'semantic-ui-css/semantic.min.css';

const form = reactive({
  companyName: '',
  address: {
    number: '',
    street: '',
    CP: '',
    town: ''
  },
  phone: '',
  services: [],
  imagePaths: []
});

const error = ref(null);
const serviceOptions = ref([]);
const showModal = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successDetails = ref({});

let newImagePath = ref('');

// Fetch available services
const fetchServices = async () => {
  try {
    const response = await axiosInstance.get('/services/type');
    serviceOptions.value = response.data;
    serviceOptions.value.forEach(service => {
      form.services.push({id: service.servicetypes_id, name: service.name, price: '', selected: false});
    });
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

// Toggle service selection
const toggleService = (serviceId) => {
  const service = form.services.find(s => s.id === serviceId);
  if (service) {
    service.selected = !service.selected; // Toggle selection
  }
};

// Handle image path input
const addImagePath = (path) => {
  if (path) {
    form.imagePaths.push(path);
    newImagePath.value = ''; // Clear input after adding
  }
};

const submitForm = async () => {
  error.value = null; // Clear previous error message
  console.log('Form data before formatting:', JSON.parse(JSON.stringify(form)));

  const selectedServices = form.services.filter(service => service.selected && service.price).map(({
                                                                                                     selected,
                                                                                                     ...rest
                                                                                                   }) => rest);
  const invalidService = form.services.find(service => service.selected && !service.price);

  if (invalidService) {
    alert(`Please provide a price for the selected service: ${invalidService.name}`);
    return;
  }

  // Trim spaces from the street field
  const trimmedStreet = form.address.street.trim();

  try {
    const dataToSend = {
      companyName: form.companyName,
      address: {
        number: form.address.number,
        street: trimmedStreet,
        CP: form.address.CP,
        town: form.address.town,
      },
      phone: form.phone,
      services: selectedServices,
      imagePaths: form.imagePaths,
    };

    console.log('Form data being sent:', dataToSend);

    const response = await axiosInstance.post('/services', dataToSend);

    successTitle.value = 'Création réussie';
    successMessage.value = "L'entreprise de service a été créée avec succès.";
    successDetails.value = response.data;
    showModal.value = true;

    resetForm();
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

const resetForm = () => {
  form.companyName = '';
  form.address = {number: '', street: '', CP: '', town: ''};
  form.phone = '';
  form.services = [];
  form.imagePaths = [];
};

// Fetch services on component mount
onMounted(fetchServices);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <form class="ui form" @submit.prevent="submitForm">
      <div class="field">
        <label>Nom de l'Entreprise</label>
        <input type="text" v-model="form.companyName" required/>
      </div>
      <div class="field">
        <label>Adresse</label>
        <input type="text" v-model="form.address.number" placeholder="Numéro" required/>
        <input type="text" v-model="form.address.street" placeholder="Rue" required/>
        <input type="text" v-model="form.address.CP" placeholder="Code Postal" required/>
        <input type="text" v-model="form.address.town" placeholder="Ville" required/>
      </div>
      <div class="field">
        <label>Téléphone</label>
        <input type="text" v-model="form.phone" required/>
      </div>
      <div class="field">
        <label>Services</label>
        <div v-for="service in form.services" :key="service.id" class="ui grid">
          <div class="row">
            <div class="six wide column">
              <input type="checkbox" :checked="service.selected" @change="toggleService(service.id)">
              <label>{{ service.name }}</label>
            </div>
            <div class="ten wide column">
              <input type="number" v-model="service.price" placeholder="Prix" :disabled="!service.selected"/>
            </div>
          </div>
        </div>
      </div>
      <div class="field">
        <label>Image Paths</label>
        <input type="text" v-model="newImagePath" @keyup.enter="addImagePath(newImagePath)"
               placeholder="Enter image path and press Enter"/>
        <ul>
          <li v-for="(path, index) in form.imagePaths" :key="index">{{ path }}</li>
        </ul>
      </div>
      <button class="ui button" type="submit">Submit</button>
      <div v-if="error" class="ui red message">{{ error }}</div>
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

.ui.grid {
  align-items: center;
  margin-bottom: 10px;
}

.ui.input {
  margin-top: 5px;
}
</style>
