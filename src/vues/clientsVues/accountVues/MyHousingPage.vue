<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from "/src/components/HeaderComponent.vue";
import FooterComponent from "/src/components/FooterComponent.vue";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/Axios.js";
import { onMounted, ref } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import { useRoute } from 'vue-router';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import PhotoCarousel from '/src/components/PhotoCarousel.vue';

const route = useRoute();

const error = ref(null);
const user = ref({});
const apartments = ref([]);
const token = Cookies.get('token');
const decodedToken = VueJwtDecode.decode(token);
const role = decodedToken.urole;
const userId = parseInt(decodedToken.uid, 10);

const parseStringArray = (stringArray) => {
  try {
    const cleanedString = stringArray.slice(1, -1);
    const parsedArray = cleanedString.split('","').map(str => {
      const relativePath = str.replace(/"/g, '').replace(/{/g, '').replace(/}/g, '');
      return relativePath;
    });
    return parsedArray;
  } catch (e) {
    console.error('Error parsing string array:', e);
    return [];
  }
};

const parseFeaturesString = (string) => {
  try {
    return string.split(',').map(item => item.replace(/"/g, '').replace(/{/g, '').replace(/}/g, '').trim());
  } catch (e) {
    console.error('Error parsing features string:', e);
    return [];
  }
};

const transformCalendarData = (calendar) => {
  return calendar.map(event => ({
    start: event.date,
    end: event.date,
    title: event.available ? 'true' : 'false'
  }));
};

const fetchApartmentDetails = async () =>{
  const apartmentsResponse = await axiosInstance.get(`/apartments/user/${userId}/`);
  if (apartmentsResponse.status !== 200) {
    throw new Error(`HTTP error! status: ${apartmentsResponse.status}`);
  }
  apartments.value = apartmentsResponse.data.map(apartment => {
    apartment.images = parseStringArray(apartment.images);
    apartment.features = parseFeaturesString(apartment.features);
    apartment.events = transformCalendarData(apartment.calendar);
    return apartment;
  });
}

const fetchUserDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/users/${userId}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = response.data;
    data.telephone = data.telephone || '';
    user.value = data;

    await fetchApartmentDetails();
  } catch (err) {
    error.value = err.message;
  }
};

if (role === 'owner') {
  onMounted(fetchUserDetails);
}

const handleCellClick = async (date, apartment) => {
  console.log('Cell clicked:', date);
  const clickedDate = date.toLocaleDateString('en-CA');
  console.log('Clicked Date:', clickedDate);

  let event = apartment.events.find(e => e.start === clickedDate);
  console.log('Event:', event);

  const requestData = {
    apartment_id: apartment.apartments_id,
    dates: [
      {
        date: clickedDate,
        available: event ? 'available' : 'unavailable'
      }
    ]
  };
  console.log("Sending PATCH request with data:", requestData);

  try {
    await axiosInstance.patch(`/apartmentsCalendar/availability/${apartment.apartments_id}/`, requestData);
    console.log(`Date: ${clickedDate}, Status: ${event ? 'available' : 'unavailable'}`);
    await fetchApartmentDetails();
  } catch (err) {
    console.log(`Failed to update availability: ${err.message}`);
  }
};

const formattedDescription = (description) => {
  if (!description) {
    return '';
  }

  try {
    const descObject = JSON.parse(description);
    return Object.entries(descObject)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
  } catch (e) {
    return description;
  }
};
</script>

<template>
  <div>
    <HeaderComponent/>
    <div class="account-container">
      <AccountMenuComponent/>
      <div class="content-container">
        <div class="content">
          <h2>{{ $t('my-housing') }}</h2>
          <p v-if="role !== 'owner'">Vous ne nous avez pas encore confié de bien</p>
          <div v-else>
            <div v-for="apartment in apartments" :key="apartment.apartments_id" class="ui segment apartment-segment">
              <header class="ui header">
                <h1>{{ apartment.name }}</h1>
                <p>{{ apartment.street }}, {{ apartment.town }}</p>
              </header>
              <div class="ui divider"></div>
              <PhotoCarousel v-if="apartment.images && apartment.images.length" :photos="apartment.images"
                             class="ui medium images"/>
              <div class="ui segment">
                <h2 class="ui header">Informations de base</h2>
                <p><strong>Prix :</strong> {{ apartment.price }}€</p>
                <p><strong>Surface :</strong> {{ apartment.surface }} m²</p>
                <p><strong>Nombre de chambres :</strong> {{ apartment.numberofroom }}</p>
              </div>
              <div class="ui segment">
                <h2 class="ui header">Description détaillée</h2>
                <p>{{ formattedDescription(apartment.description) }}</p>
                <h3 class="ui header">Équipements</h3>
                <ul class="ui list">
                  <li v-for="amenity in apartment.features" :key="amenity">{{ amenity }}</li>
                </ul>
                <vue-cal
                    xsmall
                    :disable-views="['day','year','years','week']"
                    events-count-on-year-view
                    active-view="month"
                    :events="apartment.events"
                    @cell-click="date => handleCellClick(date, apartment)">
                </vue-cal>
              </div>
              <div class="ui segment">
                <h2 class="ui header">Informations supplémentaires</h2>
                <p><strong>Règles de location :</strong> {{ apartment.rules }}</p>
                <p><strong>Conditions de paiement :</strong></p>
              </div>
            </div>
          </div>
        </div>
        <div class="spacer"></div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.account-container {
  display: flex;
  margin-top: 5%;
}

.content-container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.apartment-segment {
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.ui.segment {
  margin-top: 20px;
}

.field {
  margin-bottom: 15px;
}

footer {
  margin-top: auto;
}

.ui.medium.images {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
