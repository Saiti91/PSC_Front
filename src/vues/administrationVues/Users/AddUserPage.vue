<script setup>
import { ref } from 'vue';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "@/components/HeaderAdmin.vue";
import 'semantic-ui-css/semantic.min.css';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const roles = ['admin', 'staff', 'owner', 'customer'];
const error = ref(null);
const success = ref(null);

const currentUserRole = ref('staff'); // Suppose the role of the current logged-in user is fetched from your auth system

const addUser = async () => {
  error.value = null;
  success.value = null;

  if (role.value === 'admin' && currentUserRole.value !== 'admin') {
    error.value = 'You do not have permission to create an admin user.';
    return;
  }

  try {
    const payload = {
      email: email.value,
      password: 'password', // Assurez-vous de générer un mot de passe sécurisé en production
      first_name: firstName.value,
      last_name: lastName.value,
      role: role.value
    };

    const response = await axiosInstance.post('/auth/register', payload);

    // Vérifiez si le code de réponse est soit 200 soit 201
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    success.value = 'User added successfully!';
  } catch (err) {
    error.value = err.message;
  }
};

</script>
<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div v-if="error" class="ui negative message">{{ error }}</div>
    <div v-if="success" class="ui positive message">{{ success }}</div>

    <form class="ui form" @submit.prevent="addUser">
      <div class="field">
        <label>First Name</label>
        <input type="text" v-model="firstName" required>
      </div>

      <div class="field">
        <label>Last Name</label>
        <input type="text" v-model="lastName" required>
      </div>

      <div class="field">
        <label>Email</label>
        <input type="email" v-model="email" required>
      </div>

      <div class="field">
        <label>Role</label>
        <select class="ui dropdown" v-model="role" required>
          <option disabled value="">Please select one</option>
          <option v-for="roleOption in roles" :key="roleOption" :value="roleOption">{{ roleOption }}</option>
        </select>
      </div>

      <button class="ui primary button" type="submit">Add User</button>
    </form>
  </div>
</template>


<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.spacer {
  margin-top: 2%; /* Réduisez la marge supérieure si nécessaire */
}

.ui.container {
  max-width: 500px;
  margin: 20px auto; /* Centrez le conteneur et ajoutez une petite marge supérieure */
}

.ui.form .field {
  width: 100%;
}

.ui.container form {
  margin-bottom: 20px; /* Ajoutez une marge inférieure pour un peu d'espacement */
}

</style>
