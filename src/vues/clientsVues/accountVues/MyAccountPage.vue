<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import axiosInstance from "@/utils/Axios.js";
import Cookies from "js-cookie";
import VueJwtDecode from 'vue-jwt-decode';
import Swal from "sweetalert2";

const token = Cookies.get('token');
const error = ref(null);
const router = useRouter();

const deleteUser = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  const userId = parseInt(decodedToken.uid, 10);
  try {
    const response = await axiosInstance.delete(`/users/${userId}/`);
    if (response.status == 403) {
      Swal.fire("Erreur", "Vous ne pouvez pas supprimer votre compte si vous nous avez confié un bien. Faites une demande auprès de l'assistance pour vous retirer de nos services", "error");
    } else if (response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      Swal.fire("Succès", "Utilisateur supprimé avec succès", "success");
      // Redirigez l'utilisateur vers une autre page après la suppression
      router.push('/sign-up');
    }
  } catch (err) {
    error.value = err.message;
    Swal.fire("Erreur", error.value, "error");
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
          <button class="ui button primary" @click="deleteUser">{{ $t('left-btn') }}</button>
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
