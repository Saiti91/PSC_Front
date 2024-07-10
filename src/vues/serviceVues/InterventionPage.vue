<script setup>
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderService.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
</script>

<template>
  <div class="ui container" style="height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>

    <div class="ui basic segment flex-grow" style="display: flex; justify-content: center; align-items: center;">
      <h1 class="ui center aligned icon header">
        <i class="cogs icon"></i>
        En cours de construction...
      </h1>
    </div>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.flex-grow {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
</style>
