<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import { ref } from 'vue';

const formData = ref({
  streetNumber: '',
  streetName: '',
  addressComplement: '',
  building: '',
  apartmentNumber: '',
  city: '',
  postalCode: '',
  apartmentType: '',
  area: '',
  guests: '',
  bedrooms: '',
  price: '',
  propertyName: '',
  features: {
    pool: false,
    garden: false,
    terrace: false,
    balcony: false,
    sauna: false,
    otherChecked: false, // New property for the "Other" checkbox
    otherDescription: '' // Text input for describing "Other" feature
  },
  agree: false
});

const hasErrors = ref(false);

const submitForm = () => {
  hasErrors.value = !formData.value.agree; // Simple validation for agreement
  if (!hasErrors.value) {
    // Simulate form submission
    console.log('Form Data:', formData.value);
    // Here you would typically send the data to your API
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
              <div class="eight wide field">
                <label>{{ $t('street-number') }}</label>
                <input v-model="formData.streetNumber" type="text" placeholder="2">
              </div>
              <div class="eight wide field">
                <label>{{ $t('street-name') }}</label>
                <input v-model="formData.streetName" type="text" placeholder="Avenue Chrales de Gaulle">
              </div>
            </div>
            <div class="field">
              <label>{{ $t('address-complement') }}</label>
              <input v-model="formData.addressComplement" type="text" placeholder="chez Madame Michel">
            </div>
            <div class="fields">
              <div class="eight wide field">
                <label>{{ $t('building') }}</label>
                <input v-model="formData.building" type="text" placeholder="A">
              </div>
              <div class="eight wide field">
                <label>{{ $t('apartment-number') }}</label>
                <input v-model="formData.apartmentNumber" type="text" placeholder="12">
              </div>
            </div>
            <div class="fields">
              <div class="eight wide field">
                <label>{{ $t('city') }}</label>
                <input v-model="formData.city" type="text" placeholder="Paris" required>
              </div>
              <div class="eight wide field">
                <label>{{ $t('postal-code') }}</label>
                <input v-model="formData.postalCode" type="text" placeholder="75004" required>
              </div>
            </div>
            <div class="field">
              <label>{{ $t('housing-type') }}</label>
              <input v-model="formData.apartmentType" type="text" placeholder=" T3" required>
            </div>
          </div>
          <!-- Property Details -->
          <div class="ui segment">
            <h3>{{ $t('property-details') }}</h3>
            <div class="fields">
              <div class="four wide field">
                <label>{{ $t('area') }}</label>
                <input v-model="formData.area" type="number" placeholder="45" required>
              </div>
              <div class="four wide field">
                <label>{{ $t('guests') }}</label>
                <input v-model="formData.guests" type="number" placeholder="6" required>
              </div>
              <div class="four wide field">
                <label>{{ $t('bedrooms') }}</label>
                <input v-model="formData.bedrooms" type="number" placeholder="2" required>
              </div>
              <div class="four wide field">
                <label>{{ $t('price') }}</label>
                <input v-model="formData.price" type="number" placeholder="150" required>
              </div>
            </div>
            <div class="field">
              <label>{{ $t('property-name') }}</label>
              <input v-model="formData.propertyName" type="text" placeholder="Villa au bord de la mer">
            </div>
          </div>
          <!-- Features -->
          <div class="ui segment">
            <h3>{{ $t('features') }}</h3>
            <div class="ui checkbox">
              <input v-model="formData.features.pool" type="checkbox" id="pool">
              <label for="pool" class="spaced-label">{{ $t('pool') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="formData.features.garden" type="checkbox" id="garden">
              <label for="garden" class="spaced-label">{{ $t('garden') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="formData.features.terrace" type="checkbox" id="terrace">
              <label for="terrace" class="spaced-label">{{ $t('terrace') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="formData.features.balcony" type="checkbox" id="balcony">
              <label for="balcony" class="spaced-label">{{ $t('balcony') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="formData.features.sauna" type="checkbox" id="sauna">
              <label for="sauna" class="spaced-label">{{ $t('sauna') }}</label>
            </div>
            <div class="ui checkbox">
              <input v-model="formData.features.otherChecked" type="checkbox" id="other">
              <label for="other" class="spaced-label">{{ $t('other') }}</label>
            </div>
            <div v-if="formData.features.otherChecked" class="field spaced">
              <label>{{ $t('other-description') }}</label>
              <input v-model="formData.features.otherDescription" type="text" placeholder="lit bébé">
            </div>
          </div>
          <!-- Captcha and Submit -->
          <div class="ui segment">

            <div class="field">
              <div class="ui checkbox">
                <input v-model="formData.agree" type="checkbox" id="agree" required>
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
</style>
