<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import 'semantic-ui-css/semantic.min.css';
import axiosInstance from "@/utils/Axios.js";

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const submitForm = async () => {
  errorMessage.value = ''; // Clear previous error message

  if (!validateEmail(email.value)) {
    errorMessage.value = 'Invalid email format';
    console.log('Error Message:', errorMessage.value); // Debugging
    return;
  }

  const data = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await axiosInstance.post('auth/login/', data);
    if (response.status !== 200) {
      errorMessage.value = `Error: ${response.status}`;
      console.log('Error Message:', errorMessage.value); // Debugging
      return;
    }

    const authHeader = response.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token) {
      Cookies.set('token', token);
      console.log('Token stored in cookies:', token);

      const decodedToken = VueJwtDecode.decode(token);
      if (decodedToken.urole === 'admin' || decodedToken.urole === 'staff') {
        router.push('/accueil-admin');
      } else if (decodedToken.urole === 'provider') {
        router.push('/HomeServicePage');
      } else {
        router.push('/');
      }
    } else {
      errorMessage.value = 'Token not found in response headers';
      console.log('Error Message:', errorMessage.value);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage.value = 'Password or email is incorrect';
      } else if (error.response.status === 400) {
        errorMessage.value = 'Bad request: Invalid email or password format';
      } else if (error.response.data && error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = 'An error occurred';
      }
    } else {
      errorMessage.value = 'An error occurred';
    }
    console.log('Error Message:', errorMessage.value); // Debugging
  }
};
</script>

<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        <div class="content">{{ $t('account_Login') }}</div>
      </h2>
      <form class="ui large form" @submit.prevent="submitForm">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="email" v-model="email" name="email" :placeholder="$t('email')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" name="password" :placeholder="$t('password')" required>
            </div>
          </div>
          <button class="ui fluid large teal submit button" type="submit">{{ $t('login') }}</button>
        </div>

        <div class="ui error message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
      <div class="ui message">{{ $t('new_to_us') }}
        <router-link to="/sign-up" class="item">{{ $t('sign_up') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui.error.message {
  display: block !important;
}
</style>
