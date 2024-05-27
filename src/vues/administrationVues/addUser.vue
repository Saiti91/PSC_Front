<script setup>
import { ref } from 'vue';
import axiosInstance from '/src/utils/axios.js';
import HeaderComponent from "@/components/HeaderAdmin.vue";

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const roles = ['admin', 'staff', 'owner', 'provider', 'customer'];
const error = ref(null);
const success = ref(null);

const addUser = async () => {
  error.value = null;
  success.value = null;

  try {
    const response = await axiosInstance.post('/users', {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      role: role.value
    });

    if (response.status !== 201) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    success.value = 'User added successfully!';
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<template>
  <div class="ui container">
    <HeaderComponent/>
    <div class="spacer"></div>
    <h1 class="ui header">Add User</h1>

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
        <select v-model="role" required>
          <option disabled value="">Please select one</option>
          <option v-for="roleOption in roles" :key="roleOption" :value="roleOption">{{ roleOption }}</option>
        </select>
      </div>

      <button class="ui primary button" type="submit">Add User</button>
    </form>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}
.ui.container {
  max-width: 500px;
  margin-top: 50px;
}
</style>
