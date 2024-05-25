<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import { useRoleVerification } from '/src/composables/useRoleVerification.js';
import 'semantic-ui-css/semantic.min.css';


const email = ref('');
const password = ref('');
const router = useRouter();
const { userRole } = useRoleVerification();

const submitForm = async () => {
  const data = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await fetch('http://localhost:80/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      return;
    }

    // Check the response headers
    console.log('Response Headers:', response.headers);

    const authHeader = response.headers.get('Authorization');
    console.log('Authorization Header:', authHeader);

    const token = authHeader?.split(' ')[1];
    if (token) {
      Cookies.set('token', token);
      console.log('Token stored in cookies:', token);

      const decodedToken = VueJwtDecode.decode(token);
      userRole.value = decodedToken.urole;
      if (decodedToken.urole === 'admin') {
        router.push('/accueil-admin');
      } else {
        router.push('/accueil');
      }
    } else {
      console.error('Token not found in response headers');
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>
<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        <div class="content">
          Account Login
        </div>
      </h2>
      <form class="ui large form" @submit.prevent="submitForm">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="email" v-model="email" name="email" placeholder="E-mail address" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" name="password" placeholder="Password" required>
            </div>
          </div>
          <div class="ui fluid large teal submit button">Login</div>
        </div>

        <div class="ui error message"></div>
      </form>
      <div class="ui message">
        New to us? <a href="#">Sign Up</a>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>