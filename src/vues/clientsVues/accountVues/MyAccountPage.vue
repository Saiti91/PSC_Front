<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
</script>

<template>
  <div class="account-page">
  <div class="menu-container">
    <HeaderComponent />
    <div class="account-menu">
      <AccountMenuComponent />
      <div class="account-content">
        <router-view />
      </div>
    </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.menu-container {
  margin-top: 4%;
}

.account-page {
  display: flex;
}

.account-content {
  margin-left: 20%; /* Compense la largeur du menu */
  padding: 20px;
  width: 80%;
  overflow-y: auto; /* Ajoute un défilement si nécessaire */
}
</style>