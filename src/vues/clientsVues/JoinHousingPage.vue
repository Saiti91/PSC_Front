<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import { ref } from 'vue';
import axiosInstance from "@/utils/Axios.js";

const form = ref({
  address: {
    streetNumber: '',
    streetName: '',
    addressComplement: '',
    building: '',
    apartmentNumber: '',
    city: '',
    postalCode: ''
  },
  apartmentType: '',
  area: '',
  guests: '',
  bedrooms: '',
  price: '',
  propertyName: '',
  features: {
    pool: false,
    wifi: false,
    parking: false,
    balcony: false,
    air_conditioning: false
  },
  images : []
});

const errors = ref({
  streetNumber: false,
  streetName: false, // Corrected from 'street'
  postalCode: false,
  city: false,
  apartmentType: false, // Corrected from 'housingType'
  area: false,
  guests: false,
  bedrooms: false,
  price: false,
  agree: false,
  otherDescription: false
});

const hasErrors = ref(false);
const imagePreviews = ref([]); // Holds the image preview URLs

//Pour uploader des images
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

//envois du formulaire
const submitForm = async () => {
  error.value = null; // Clear previous error message
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
    const response = await axiosInstance.post('/apartments/request', formData, {
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
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <div class="ui stackable grid">
      <div class="sixteen wide column">
        <h1>{{ $t('join-us-btn') }}</h1>
        <form @submit.prevent="submitForm" class="ui form" :class="{ error: hasErrors }">
          <!-- Address Fields -->
          <div class="ui segment">
            <h3>{{ $t('property-address') }}</h3>
            <div class="fields">
              <div class="eight wide field" :class="{ 'error': errors.streetNumber }">
                <label>{{ $t('street-number') }}</label>
                <input v-model="form.streetNumber" type="text" placeholder="2">
              </div>
              <div class="eight wide field" :class="{ 'error': errors.streetName }">
                <label>{{ $t('street-name') }}</label>
                <input v-model="form.streetName" type="text" placeholder="Avenue Charles de Gaulle">
              </div>
            </div>
            <div class="field">
              <label>{{ $t('address-complement') }}</label>
              <input v-model="form.addressComplement" type="text" placeholder="chez Madame Michel">
            </div>
            <div class="fields">
              <div class="eight wide field">
                <label>{{ $t('building') }}</label>
                <input v-model="form.building" type="text" placeholder="A">
              </div>
              <div class="eight wide field">
                <label>{{ $t('apartment-number') }}</label>
                <input v-model="form.apartmentNumber" type="text" placeholder="12">
              </div>
            </div>
            <div class="fields">
              <div class="eight wide field" :class="{ 'error': errors.city }">
                <label>{{ $t('city') }}</label>
                <input v-model="form.city" type="text" placeholder="Paris" required>
              </div>
              <div class="eight wide field" :class="{ 'error': errors.postalCode }">
                <label>{{ $t('postal-code') }}</label>
                <input v-model="form.postalCode" type="text" placeholder="75004" required>
              </div>
            </div>
            <label>{{ $t('housing-type') }}</label>
            <select v-model="form.apartmentType" required>
              <option value="" disabled>Choose an option</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Flat">Flat</option>
              <option value="Villa">Villa</option>
              <option value="Chalet">Chalet</option>
            </select>
          </div>
          <!-- Property Details -->
          <div class="ui segment">
            <h3>{{ $t('property-details') }}</h3>
            <div class="fields">
              <div class="four wide field" :class="{ 'error': errors.area }">
                <label>{{ $t('area') }}</label>
                <input v-model="form.area" type="number" placeholder="45" required>
              </div>
              <div class="four wide field" :class="{ 'error': errors.guests }">
                <label>{{ $t('guests') }}</label>
                <input v-model="form.guests" type="number" placeholder="6" required>
              </div>
              <div class="four wide field" :class="{ 'error': errors.bedrooms }">
                <label>{{ $t('bedrooms') }}</label>
                <input v-model="form.bedrooms" type="number" placeholder="2" required>
              </div>
              <div class="four wide field" :class="{ 'error': errors.price }">
                <label>{{ $t('price') }}</label>
                <input v-model="form.price" type="number" placeholder="150" required>
              </div>
            </div>
            <div class="field">
              <label>{{ $t('property-name') }}</label>
              <input v-model="form.propertyName" type="text" placeholder="Villa au bord de la mer">
            </div>
          </div>
          <!-- Features -->
          <div class="ui segment">
            <h3>{{ $t('features') }}</h3>
            <div class="ui checkbox">
              <input v-model="form.features.pool" type="checkbox" id="pool">
              <label for="pool" class="spaced-label">{{ $t('pool') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="form.features.wifi" type="checkbox" id="wifi">
              <label for="wifi" class="spaced-label">Wifi</label>
            </div>
            <div class="ui checkbox">
              <input v-model="form.features.parking" type="checkbox" id="parking">
              <label for="parking" class="spaced-label">Parking</label>
            </div>
            <div class="ui checkbox">
              <input v-model="form.features.balcony" type="checkbox" id="balcony">
              <label for="balcony" class="spaced-label">{{ $t('balcony') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="form.features.air_conditioning" type="checkbox" id="air conditioning">
              <label for="air conditioning" class="spaced-label">Air conditionné</label>
            </div>
            <!--
            <div class="ui checkbox">
              <input v-model="formData.features.otherChecked" type="checkbox" id="other">
              <label for="other" class="spaced-label">{{ $t('other') }}</label>
            </div>
            <div v-if="formData.features.otherChecked" class="field spaced" :class="{ 'error': errors.otherDescription }">
              <label>{{ $t('other-description') }}</label>
              <input v-model="formData.features.otherDescription" type="text" placeholder="lit bébé">
            </div>
            -->
          </div>
          <!-- Images -->
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
          <!-- Submit -->
          <div class="ui segment">
            <div class="field" :class="{ 'error': errors.agree }">
              <div class="ui checkbox">
                <input v-model="form.agree" type="checkbox" id="agree" required>
                <label for="agree">{{ $t('agree') }}</label>
              </div>
            </div>
            <button class="ui primary button" type="submit">{{ $t('submit') }}</button>
            <div v-if="hasErrors" class="ui error message">
              <div class="header">{{ $t('form-errors') }}</div>
              <p>{{ $t('check-errors') }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="spacer"></div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.form .field {
  margin-bottom: 1rem;
}

.ui.form .checkbox {
  margin-top: 1rem;
}

.spaced-label {
  margin-right: 25px; /* Espacement entre le texte du label et la case à cocher suivante */
}

.field.spaced {
  margin-top: 10px; /* Espacement entre la checkbox "Autre" et le champ texte */
}

.field.error input,
.field.error textarea {
  border-color: red !important;
}
.field.error .ui.checkbox input[type="checkbox"] + label {
  color: red !important;
}

.ui.checkbox {
  margin-bottom: 10px;
}
</style>

