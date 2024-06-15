<script setup>
import { ref } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import 'semantic-ui-css/semantic.min.css';
// import { useRouter } from 'vue-router'

const form = ref({
  ownerEmail: '',
  surface: 0,
  capacity: 0,
  apartmentsType: '',
  numberOfRoom: 0,
  price: 0,
  address: {
    longitude: null,
    latitude: null,
    number: 0,
    addressComplement: '',
    building: '',
    apartmentNumber: null,
    street: '',
    CP: 0,
    town: ''
  },
  imagePaths: []
});

const error = ref(null);
// const router = useRouter();

const submitForm = async () => {
  console.log(form.value);
  try {
    const response = await axiosInstance.post('/apartments', form.value);
    // router.push('/success');
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
        <label>Surface</label>
        <input type="number" v-model="form.surface" required />
      </div>
      <div class="field">
        <label>Capacity</label>
        <input type="number" v-model="form.capacity" required />
      </div>
      <div class="field">
        <label>Apartment Type</label>
        <input type="text" v-model="form.apartmentsType" required />
      </div>
      <div class="field">
        <label>Number of Rooms</label>
        <input type="number" v-model="form.numberOfRoom" required />
      </div>
      <div class="field">
        <label>Price</label>
        <input type="number" v-model="form.price" required />
      </div>
      <div class="field">
        <label>Address</label>
        <input type="text" v-model="form.address.street" placeholder="Street" required />
        <input type="number" v-model="form.address.number" placeholder="Number" required />
        <input type="text" v-model="form.address.addressComplement" placeholder="Complement" />
        <input type="text" v-model="form.address.building" placeholder="Building" />
        <input type="number" v-model="form.address.apartmentNumber" placeholder="Apartment Number" />
        <input type="number" v-model="form.address.CP" placeholder="Postal Code" required />
        <input type="text" v-model="form.address.town" placeholder="Town" required />
        <input type="number" v-model="form.address.longitude" placeholder="Longitude" />
        <input type="number" v-model="form.address.latitude" placeholder="Latitude" />
      </div>
      <div class="field">
        <label>Image Paths</label>
        <input type="text" v-model="form.imagePaths" placeholder="Image Paths (comma separated)" />
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
