<script setup>
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderServiceVue.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const fetchcalendar = async () => {
  error.value = null;
  const token  = Cookies.get('token');
  const decodedToken = VueJwtDecode.decode(token);
  console.log(decodedToken)
  const userId = parseInt(decodedToken.uid,10)
  try {
    const response = await axiosInstance.get(`/serviceCalendar/${userId}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    calendar.value = response.data;
    console.log(response.data);
  } catch (err) {
    error.value = err.message;
  }
};
onMounted(fetchcalendar);



</script>

<template>
  style="min-height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
  <HeaderComponent/>
  <div class="spacer"></div>






  
  <FooterComponent/>
</template>

<style scoped>

</style>