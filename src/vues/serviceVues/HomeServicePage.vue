<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderService.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

const calendar = ref([]);
const events = ref([]);
const error = ref(null);
const loading = ref(false);

const transformCalendarData = (calendar) => {
  const transformedEvents = calendar.map(event => {
    let cssClass = '';
    switch (event.status_id) {
      case 1:
        cssClass = ''; // No color
        break;
      case 2:
        cssClass = 'status-pending'; // Red color
        break;
      case 3:
        cssClass = 'status-reserved'; // Light green color
        break;
    }
    console.log("Event:", event.date, "Class:", cssClass); // Debugging log
    return {
      start: event.date.split('T')[0], // Format the date to 'YYYY-MM-DD'
      end: event.date.split('T')[0], // Format the date to 'YYYY-MM-DD'
      title: 'reserved',
      class: cssClass,
    };
  });
  console.log("Transformed Events:", transformedEvents);
  return transformedEvents;
};

const fetchProviderId = async () => {
  error.value = null;
  loading.value = true;
  try {
    const token = Cookies.get('token');
    const decodedToken = VueJwtDecode.decode(token);
    const userId = parseInt(decodedToken.uid, 10);
    const response = await axiosInstance.get(`/users/${userId}/`);
    return response.data.serviceprovider_id;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchCalendar = async () => {
  error.value = null;
  loading.value = true;
  try {
    const provider_id = await fetchProviderId();
    if (!provider_id) {
      throw new Error("Provider ID not found");
    }
    const response = await axiosInstance.get(`/servicesCalendar/${provider_id}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Response data:", response.data);
    calendar.value = response.data;
    events.value = transformCalendarData(calendar.value);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCalendar);
</script>

<template>
  <div class="ui container full-width"
       style="min-height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div v-if="loading" class="ui active centered inline loader"></div>
    <div v-if="error" class="ui negative message">{{ error }}</div>

    <div v-if="!loading && !error" class="calendar-container">
      <vue-cal
          xsmall
          :disable-views="['year','years']"
          events-count-on-year-view
          active-view="month"
          :events="events.value">
      </vue-cal>
    </div>

    <FooterComponent/>
  </div>
</template>

<style>
.full-width {
  width: 100% !important;
}

.spacer {
  margin-top: 7%;
}

.calendar-container {
  display: flex;
  justify-content: center;
  padding: 0 15%;
}

.ui.footer .list {
  color: #ccc !important;
}

/* Add the styles for the status colors */
.status-pending {
  background-color: rgba(255, 0, 0, 0.3) !important; /* Light red transparent */
}

.status-reserved {
  background-color: rgba(0, 255, 0, 0.3) !important; /* Light green transparent */
}
</style>
