<script setup>
import { onMounted, reactive, ref } from 'vue';
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import SuccessModalComponent from '/src/components/SuccessModal.vue';
import 'semantic-ui-css/semantic.min.css';

const form = reactive({
  name: '',
  address: {
    number: '',
    street: '',
    CP: '',
    town: ''
  },
  phone: '',
  email: '',
  services: []
});

const error = ref(null);
const serviceOptions = ref([]);
const showModal = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successDetails = ref({});

const fetchServices = async () => {
  try {
    const response = await axiosInstance.get('/services/type');
    serviceOptions.value = response.data;
    serviceOptions.value.forEach(service => {
      form.services.push({ id: service.servicetypes_id, name: service.name, price: '', selected: false });
    });
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};

const toggleService = (serviceId) => {
  const service = form.services.find(s => s.id === serviceId);
  if (service) {
    service.selected = !service.selected;
  }
};

const submitForm = async () => {
  error.value = null;
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

  const trimmedStreet = form.address.street.trim();

  try {
    const dataToSend = {
      name: form.name,
      address: {
        number: form.address.number,
        street: trimmedStreet,
        CP: form.address.CP,
        town: form.address.town,
      },
      phone: form.phone,
      email: form.email,
      services: selectedServices
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
  form.name = '';
  form.address = {number: '', street: '', CP: '', town: ''};
  form.phone = '';
  form.email = '';
  form.services = [];
};

onMounted(fetchServices);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <h1 class="ui header">{{ $t('join-us-btn')}}</h1>
    <form class="ui form" @submit.prevent="submitForm">
      <div class="ui segment">
        <h3>Informations de l'entreprise</h3>
        <div class="field">
          <label>Nom de l'Entreprise</label>
          <input type="text" v-model="form.name" required/>
        </div>
        <div class="fields">
          <div class="eight wide field">
            <label>Numéro</label>
            <input type="text" v-model="form.address.number" required/>
          </div>
          <div class="eight wide field">
            <label>Rue</label>
            <input type="text" v-model="form.address.street" required/>
          </div>
        </div>
        <div class="fields">
          <div class="eight wide field">
            <label>Code Postal</label>
            <input type="text" v-model="form.address.CP" required/>
          </div>
          <div class="eight wide field">
            <label>Ville</label>
            <input type="text" v-model="form.address.town" required/>
          </div>
        </div>
        <div class="field">
          <label>Téléphone</label>
          <input type="text" v-model="form.phone" required/>
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" v-model="form.email" required/>
        </div>
      </div>
      <div class="ui segment">
        <h3>Services</h3>
        <div v-for="service in form.services" :key="service.id" class="ui grid">
          <div class="row">
            <div class="eight wide column">
              <div class="ui checkbox">
                <input type="checkbox" :checked="service.selected" @change="toggleService(service.id)"/>
                <label>{{ service.name }}</label>
              </div>
            </div>
            <div class="eight wide column">
              <input type="number" v-model="service.price" placeholder="Prix" :disabled="!service.selected"/>
            </div>
          </div>
        </div>
      </div>
      <button class="ui primary button" type="submit">Soumettre</button>
      <div v-if="error" class="ui red message">{{ error }}</div>
    </form>
    <div class="spacer"></div>
    <FooterComponent />
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

.full-width {
  max-width: 800px;
  margin: 0 auto;
}

.ui.form .field {
  margin-bottom: 1rem;
}

.ui.segment {
  margin-top: 2rem;
}

.ui.checkbox label {
  margin-left: 0.5rem;
}

.ui.red.message {
  margin-top: 2rem;
}

.ui.grid .row {
  align-items: center;
}

button.ui.primary.button {
  margin-top: 2rem;
}
</style>