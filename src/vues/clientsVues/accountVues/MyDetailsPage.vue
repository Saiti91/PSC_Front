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

const error = ref(null);

const token = Cookies.get('token');

// Fetch user details
const fetchUserDetails = async () => {
  error.value = null;
  const decodedToken = VueJwtDecode.decode(token);
  const userId = parseInt(decodedToken.uid,10)
  try {
    const response = await axiosInstance.get(`/users/${userId}/`);
    console.log(response.data)
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
    await axiosInstance.put(`/users/${userId.value}/`, user.value);
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
    <HeaderComponent />
    <div class="account-container">
      <AccountMenuComponent />
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
              <label>{{ $t('password') }}</label>
              <input v-model="user.password" :readonly="!isEditing" type="password">
            </div>
            <div>
              <button v-if="!isEditing" class="ui button primary" @click="startEditing">{{ $t('edit') }}</button>
              <button v-if="isEditing || showSaveButton" class="ui button primary" type="submit">
                {{ $t('validate-changes') }}</button>
            </div>
          </form>
          <div v-if="error" class="ui error message">{{ error }}</div>
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
