<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from "/src/components/HeaderComponent.vue";
import FooterComponent from "/src/components/FooterComponent.vue";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/Axios.js";
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const route = useRoute();
const userId = ref(route.params.id);
const error = ref(null);
const token = Cookies.get('token');

if (token) {
  try {
    const decodedToken = VueJwtDecode.decode(token);
    console.log(decodedToken)
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() < expirationTime) {

    } else {
      Cookies.remove('token');
    }
  } catch (error) {
    console.error('Invalid token', error);
    Cookies.remove('token');
  }
}

</script>

<template>
  <div>
    <HeaderComponent />
    <div class="account-container">
      <AccountMenuComponent />
      <div class="content-container">
        <div class="content">
          <p>abonnement</p>
      </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>


<style scoped>
.account-container {
  display: flex;
  margin-top: 5%;
}

.content-container {
  flex: 1;
  padding: 20px;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 15px;
}

footer {
  margin-top: auto;
}
</style>
