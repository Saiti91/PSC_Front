<script setup>
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderServiceVue.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import Swal from "sweetalert2";

const user = ref(null);
const error = ref(null);

const fetchUserDetails = async () => {
  error.value = null;
  try {
    const token  = Cookies.get('token');
    const decodedToken = VueJwtDecode.decode(token);
    const userId = parseInt(decodedToken.uid,10)
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
    await axiosInstance.post(`/users/${userId}/`, user.value);
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
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <h1 class="ui header">User Details</h1>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else-if="user">
        <div class="ui segment">
          <h2 class="ui header">{{ user.first_name }} {{ user.last_name }}</h2>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong></strong>{{user.telephone}}</p>
          <p><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</p>

          <p><strong>Change Password:</strong>{{user.password}}</p>

        </div>
      </div>
      <div v-else class="ui active inline loader"></div>
    </div>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.container {
  max-width: 800px;
  margin-top: 50px;
}

.ui.segment {
  margin-top: 20px;
}
</style>
