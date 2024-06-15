<script setup>
import { ref } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import 'semantic-ui-css/semantic.min.css';

const form = ref({
  ownerEmail: '',
  surface: '',
  capacity: '',
  apartmentsType: '',
  numberOfRoom: '',
  price: '',
  address: {
    longitude: null,
    latitude: null,
    number: '',
    addressComplement: '',
    building: '',
    apartmentNumber: null,
    street: '',
    CP: '',
    town: ''
  },
  imagePaths: []
});

const error = ref(null);

const handleFileUpload = (event) => {
  const files = event.target.files;
  form.value.imagePaths = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === 'image/png' || files[i].type === 'image/jpeg') {
      form.value.imagePaths.push(files[i]);
    } else {
      alert('Only PNG or JPEG images are allowed');
    }
  }
};

const submitForm = async () => {
  console.log(form.value);
  try {
    const formData = new FormData();
    for (const key in form.value) {
      if (key !== 'imagePaths') {
        formData.append(key, form.value[key]);
      } else {
        for (let i = 0; i < form.value.imagePaths.length; i++) {
          formData.append('imagePaths', form.value.imagePaths[i]);
        }
      }
    }
    const response = await axiosInstance.post('/apartments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  }
};
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <form class="ui form" @submit.prevent="submitForm">
      <div class="field">
        <label>Owner Email</label>
        <input type="email" v-model="form.ownerEmail" required />
      </div>
      <div class="field">
        <label>Surface (m²)</label>
        <input type="number" v-model="form.surface" required />
      </div>
      <div class="field">
        <label>Capacity (nb personne)</label>
        <input type="number" v-model="form.capacity" required />
      </div>
      <div class="field">
        <label>Apartment Type</label>
        <select v-model="form.apartmentsType" required>
          <option value="" disabled>Choose an option</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
          <!-- Add more options as needed -->
        </select>
      </div>
      <div class="field">
        <label>Number of Rooms</label>
        <input type="number" v-model="form.numberOfRoom" required />
      </div>
      <div class="field">
        <label>Price by night</label>
        <input type="number" step="0.01" v-model="form.price" required />
      </div>
      <div class="field">
        <label>Address</label>
        <label>Street name</label>
        <input type="text" v-model="form.address.street" placeholder="Street name" required />
        <label>Street number</label>
        <input type="number" v-model="form.address.number" placeholder="Street number" required />
        <label>Address Complement</label>
        <select v-model="form.address.addressComplement">
          <option value="">None</option>
          <option value="bis">Bis</option>
          <option value="ter">Ter</option>
        </select>
        <label>Building number or letter</label>
        <input type="text" v-model="form.address.building" placeholder="Building" />
        <label>Apartment Number</label>
        <input type="number" v-model="form.address.apartmentNumber" placeholder="Apartment Number" />
        <label>State</label>
        <input type="text" v-model="form.address.CP" placeholder="State" required />
        <label>Town</label>
        <input type="text" v-model="form.address.town" placeholder="Town" required/>
      </div>
      <div class="field">
        <label>Image Paths</label>
        <input type="file" @change="handleFileUpload" accept=".png, .jpeg" multiple/>
      </div>
      <button class="ui button" type="submit">Submit</button>
      <div v-if="error" class="ui red message">
        {{ error }}
      </div>
    </form>
    <div class="spacer"></div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}
</style>
