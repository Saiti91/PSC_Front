<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import Cookies from "js-cookie";
import VueJwtDecode from 'vue-jwt-decode';
import Swal from "sweetalert2";

const token = Cookies.get('token');

// Trouvez comment faire marcher cette fonction :
// - régler pb droit pour suppression
// - voir comment on fait pour que ça marche avec le bouton
// - s'assurer que si l'utilisateur est proprio d'un bien il ne puisse pas supprimer lui-même son compte
const deleteUser = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  console.log(decodedToken)
  try {
    const response = await axiosInstance.delete(`/users/${decodedToken.uid}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    user.value = response.data;
    console.log(user.value)
    console.log(response.data)
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<template>
  <div>
    <HeaderComponent />
    <div class="account-container">
      <AccountMenuComponent />
      <div class="content-container">
        <div class="content">
          <h2>{{ $t('left-title') }}</h2>
          <p>{{ $t('left-txt') }}</p>
          <button  class="ui button primary" type="submit">{{ $t('left-btn') }}</button>
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
