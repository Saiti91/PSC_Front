<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;" v-if="serviceDetails">
      <h1 class="ui header">{{ serviceDetails.name }}</h1>
      <div class="ui segment">
        <h2>{{ $t('service_details') }}</h2>
        <p><strong>{{ $t('telephone') }}:</strong> {{ serviceDetails.telephone }}</p>
        <p><strong>{{ $t('address') }}:</strong> {{ fullAddress }}</p>
        <p><strong>{{ $t('employee_count') }}:</strong> {{ serviceDetails.employee_count }}</p>
        <p><strong>{{ $t('max_operating_radius') }}:</strong> {{ serviceDetails.maxoperatingradius }} km</p>

        <h3>{{ $t('services_offered') }}</h3>
        <div v-for="service in serviceDetails.services" :key="service.name" class="ui segment">
          <p><strong>{{ $t('service_name') }}:</strong> {{ service.name }}</p>
          <p><strong>{{ $t('price') }}:</strong> {{ service.price }} €</p>
        </div>
      </div>
    </div>
    <div v-else class="ui active centered inline loader"></div>
    <FooterComponent/>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "/src/components/HeaderAdmin.vue";
import FooterComponent from "/src/components/FooterComponent.vue";

const serviceDetails = ref(null);
const error = ref(null);
const route = useRoute();
const serviceId = ref(route.params.id);

const fetchServiceDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/services/${serviceId.value}/`);
    console.log(response.data)
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    serviceDetails.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchServiceDetails);

const fullAddress = computed(() => {
  const details = serviceDetails.value;
  if (!details) return '';
  return `${details.number} ${details.street}, ${details.building}, ${details.apartmentnumber}, ${details.addresscomplement}, ${details.town} ${details.cp}`;
});
</script>

<style scoped>
.ui.container {
  margin-top: 20px;
}

.spacer {
  margin-top: 7%;
}
</style>
