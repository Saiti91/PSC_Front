<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from "/src/components/HeaderComponent.vue";
import FooterComponent from "/src/components/FooterComponent.vue";
import Swal from "sweetalert2";
import axiosInstance from "@/utils/Axios.js";
import {onMounted, ref} from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import {useRoute} from 'vue-router';

const route = useRoute();

const error = ref(null);
const user = ref({});
const token = Cookies.get('token');
const decodedToken = VueJwtDecode.decode(token);
const userId = parseInt(decodedToken.uid, 10);
console.log(token);

// Fetch user details
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
    console.log(response.data);
  } catch (err) {
    error.value = err.message;
  }
};

const showSaveButton = ref(false);
const isEditing = ref(false);

// Start editing
const startEditing = () => {
  isEditing.value = true;
  showSaveButton.value = true;
};

// Submit form
const submitForm = () => {
  saveChanges();
};

// Save changes
const saveChanges = async () => {
  error.value = null;
  try {
    const userPayload = {...user.value};
    delete userPayload.created_at; // Suppression de la propriété created_at
    if (userPayload.telephone === '') {
      delete userPayload.telephone; // Supprimez telephone s'il est vide
    }
    if (userPayload.address_id === null) {
      delete userPayload.address_id; // Supprimez address_id s'il est null
    }
    if (userPayload.serviceprovider_id === null) {
      delete userPayload.serviceprovider_id; // Supprimez serviceprovider_id s'il est null
    }
    await axiosInstance.patch(`/users/${userId}/`, userPayload);
    Swal.fire("Modifications enregistrées", "", "success");
    showSaveButton.value = false;
    isEditing.value = false;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchUserDetails);
</script>


<template>
  <div>
    <HeaderComponent/>
    <div class="account-container">
      <AccountMenuComponent/>
      <div class="content-container">
        <div class="content">
          <h2>{{ $t('personal-info') }}</h2>
          <form @submit.prevent="submitForm" class="ui form" v-if="user">
            <div class="field">
              <label>{{ $t('last-name') }}</label>
              <input v-model="user.last_name" :readonly="!isEditing" type="text">
            </div>
            <div class="field">
              <label>{{ $t('first-name') }}</label>
              <input v-model="user.first_name" :readonly="!isEditing" type="text">
            </div>
            <div class="field">
              <label>{{ $t('email') }}</label>
              <input v-model="user.email" :readonly="!isEditing" type="email">
            </div>
            <div class="field">
              <label>{{ $t('phone') }}</label>
              <input v-model="user.telephone" :readonly="!isEditing" type="tel">
            </div>
            <div class="field">
              <label>{{ $t('password') }}</label>
              <input v-model="user.password" :readonly="!isEditing" type="password">
            </div>
            <div>
              <button v-if="!isEditing" class="ui button primary" @click="startEditing">{{ $t('edit') }}</button>
              <button v-if="isEditing || showSaveButton" class="ui button primary" type="submit">
                {{ $t('validate-changes') }}
              </button>
            </div>
          </form>
          <div v-if="error" class="ui error message">{{ error }}</div>
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
