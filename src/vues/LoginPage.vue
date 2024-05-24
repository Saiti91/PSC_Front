<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import { useRoleVerification } from '/src/composables/useRoleVerification.js';

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
  <div class="login-container">
    <form @submit.prevent="submitForm" class="login-form">
      <h2 class="login-title">ACCOUNT LOGIN</h2>
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="email" v-model="email" id="email" placeholder="Email" required/>
      </div>
      <div class="input-group">
        <label for="password">PASSWORD</label>
        <input type="password" v-model="password" id="password" placeholder="Password" required/>
      </div>
      <div class="options">
        <div>
          <input type="checkbox" id="remember-me"/>
          <label for="remember-me">Remember me</label>
        </div>
        <a href="#" class="forgot-password">Forgot Password?</a>
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-width: 100%;
}

.login-title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input {
  width: calc(100% - 20px);
  padding: 0.5rem 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.options .forgot-password {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.options .forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #555;
}
</style>
