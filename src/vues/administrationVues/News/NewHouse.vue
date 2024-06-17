<script setup>
import {ref} from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import SuccessModalComponent from '/src/components/SuccessModal.vue';
import 'semantic-ui-css/semantic.min.css';

const form = ref({
  ownerEmail: '',
  name: '',
  surface: '',
  capacity: '',
  apartmentsType: '',
  numberOfRoom: '',
  price: '',
  address: {
    longitude: '',
    latitude: '',
    number: '',
    addressComplement: '',
    building: '',
    apartmentNumber: '',
    street: '',
    CP: '',
    town: ''
  },
  images: [] // Holds the image files
});

const originalFormData = JSON.parse(JSON.stringify(form.value)); // Clone original form data for resetting
const error = ref(null);
const imagePreviews = ref([]); // Holds the image preview URLs
const showModal = ref(false);
const successTitle = ref('');
const successMessage = ref('');
const successDetails = ref({}); // Holds the success details

const handleFileUpload = (files) => {
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === 'image/png' || files[i].type === 'image/jpeg') {
      form.value.images.push(files[i]);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    } else {
      alert('Only PNG or JPEG images are allowed');
    }
  }
};

const onFileChange = (event) => {
  handleFileUpload(event.target.files);
};

const onDrop = (event) => {
  event.preventDefault();
  handleFileUpload(event.dataTransfer.files);
};

const onDragOver = (event) => {
  event.preventDefault();
};

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(originalFormData)); // Reset form to original values
  imagePreviews.value = [];
};

const submitForm = async () => {
  console.log(form.value);
  try {
    const formData = new FormData();
    for (const key in form.value) {
      if (key === 'address') {
        // Ajouter chaque propriété de l'objet address séparément
        for (const addressKey in form.value.address) {
          formData.append(`address[${addressKey}]`, form.value.address[addressKey]);
        }
      } else if (key === 'images') {
        for (let i = 0; i < form.value.images.length; i++) {
          formData.append('images', form.value.images[i]);
        }
      } else {
        formData.append(key, form.value[key]);
      }
    }
    console.log(form.value);
    const response = await axiosInstance.post('/apartments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);

    // Set success modal details
    successTitle.value = 'Création réussie';
    successMessage.value = 'L\'appartement a été créé avec succès.';
    successDetails.value = response.data;
    showModal.value = true;

    // Réinitialiser le formulaire
    resetForm();
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
        <input type="email" v-model="form.ownerEmail" required/>
      </div>
      <div class="field">
        <label>Name</label>
        <input type="text" v-model="form.name" required/>
      </div>
      <div class="field">
        <label>Surface (m²)</label>
        <input type="number" v-model="form.surface" required/>
      </div>
      <div class="field">
        <label>Capacity (nb personne)</label>
        <input type="number" v-model="form.capacity" required/>
      </div>
      <div class="field">
        <label>Apartment Type</label>
        <select v-model="form.apartmentsType" required>
          <option value="" disabled>Choose an option</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
        </select>
      </div>
      <div class="field">
        <label>Number of Rooms</label>
        <input type="number" v-model="form.numberOfRoom" required/>
      </div>
      <div class="field">
        <label>Price by night</label>
        <input type="number" step="0.01" v-model="form.price" required/>
      </div>
      <div class="field">
        <label>Address</label>
        <label>Street name</label>
        <input type="text" v-model="form.address.street" placeholder="Street name" required/>
        <label>Street number</label>
        <input type="number" v-model="form.address.number" placeholder="Street number" required/>
        <label>Address Complement</label>
        <select v-model="form.address.addressComplement">
          <option value="">None</option>
          <option value="bis">Bis</option>
          <option value="ter">Ter</option>
        </select>
        <label>Building number or letter</label>
        <input type="text" v-model="form.address.building" placeholder="Building"/>
        <label>Apartment Number</label>
        <input type="number" v-model="form.address.apartmentNumber" placeholder="Apartment Number"/>
        <label>CP</label>
        <input type="number" v-model="form.address.CP" placeholder="CP" required/>
        <label>Town</label>
        <input type="text" v-model="form.address.town" placeholder="Town" required/>
      </div>
      <div class="field">
        <label>Image Upload</label>
        <div class="ui segment" @dragover="onDragOver" @drop="onDrop" @click="$refs.fileInput.click()">
          <input type="file" @change="onFileChange" accept=".png, .jpeg" multiple style="display: none;"
                 ref="fileInput"/>
          <div class="ui placeholder segment">
            <div class="ui icon header">
              <i class="file image outline icon"></i>
              Drag & Drop Images Here
            </div>
            <div class="ui divider"></div>
            <div class="ui secondary button">Or Select Files</div>
          </div>
          <div v-if="imagePreviews.length" class="ui small images">
            <img v-for="(src, index) in imagePreviews" :key="index" :src="src" class="ui image"
                 style="max-width: 150px; margin: 10px 10px 0 0;"/>
          </div>
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

.ui.small.images {
  display: flex;
  flex-wrap: wrap;
}

.ui.small.images img {
  display: inline-block;
  margin-right: 10px;
}
</style>
