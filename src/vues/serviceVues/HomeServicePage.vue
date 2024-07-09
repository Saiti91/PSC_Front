<script setup>
import { onMounted, ref } from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderServiceVue.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const calendar = ref([]);
const error = ref(null);
const loading = ref(false);

const fetchCalendar = async () => {
  error.value = null;
  loading.value = true;
  try {
    const token = Cookies.get('token');
    const decodedToken = VueJwtDecode.decode(token);
    const userId = parseInt(decodedToken.uid, 10);
    const response = await axiosInstance.get(`/serviceCalendar/${userId}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    calendar.value = response.data;
    console.log(response.data);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCalendar);
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div v-if="loading" class="ui active centered inline loader"></div>
    <div v-if="error" class="ui negative message">{{ error }}</div>

    <table v-if="!loading && !error" class="ui very basic collapsing celled table">
      <thead>
      <tr>
        <th>Employee</th>
        <th class="lundi">Lundi</th>
        <th class="mardi">Mardi</th>
        <th class="mercredi">Mercredi</th>
        <th class="jeudi">Jeudi</th>
        <th class="vendredi">Vendredi</th>
        <th class="samedi">Samedi</th>
        <th class="dimanche">Dimanche</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="entry in calendar" :key="entry.employeeId">
        <td>
          <h4 class="ui image header">
            <img :src="entry.employeeAvatar" class="ui mini rounded image">
            <div class="content">{{ entry.employeeName }}</div>
          </h4>
        </td>
        <td class="lundi" v-for="day in entry.schedule" :key="day.date">
          <div v-for="task in day.tasks" :key="task.id" :class="task.type">{{ task.time }} {{ task.address }}</div>
        </td>
      </tr>
      </tbody>
    </table>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.full-width {
  width: 100% !important;
}

.spacer {
  margin-top: 7%;
}

.menage {
  background-color: blue;
}

.plomberie {
  background-color: green;
}

.ui.special.cards {
  width: 250px; /* Width of each card */
}

.scroll-button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left {
  position: absolute;
  left: -40px;
}

.scroll-button.right {
  position: absolute;
  right: -40px;
}

.ui.footer .list {
  color: #ccc !important;
}
</style>
