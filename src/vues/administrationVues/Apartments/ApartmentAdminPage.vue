<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import 'semantic-ui-css/semantic.min.css';
import { useRouter } from 'vue-router'

const apartments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);
const router = useRouter();

const fetchApartments = async () => {
  // TODO: Implement fetch apartments
};

const prevPage = () => {
  // TODO: Implement prevPage
};

const nextPage = () => {
  // TODO: Implement nextPage
};

onMounted(fetchApartments);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <div class="header-container">
        <h1 class="ui header">Apartment Administration</h1>
      </div>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <table class="ui celled table">
          <thead>
          <tr>
            <!-- TODO: Add table headers here -->
          </tr>
          </thead>
          <tbody>
          <tr v-for="apartment in apartments" :key="apartment.id">
            <!-- TODO: Add table data here -->
          </tr>
          </tbody>
        </table>
        <!-- TODO: Add more UI here -->
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
/* TODO: Add styles here */
</style>