<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import 'semantic-ui-css/semantic.min.css';

const email = ref('');
const password = ref('');
const router = useRouter();

const submitForm = async () => {
  const data = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await fetch('http://localhost:80/auth/login/', {
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

    const authHeader = response.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (token) {
      Cookies.set('token', token);
      console.log('Token stored in cookies:', token);

      const decodedToken = VueJwtDecode.decode(token);
      if (decodedToken.urole === 'admin') {
        router.push('/accueil-admin')
      } else if (decodedToken.urole === 'provider') {
        router.push('/HomeServicePage')
      } else {
        router.push('/');
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

        <div class="ui error message"></div>
      </form>
      <div class="ui message">{{ $t('new_to_us') }}
        <router-link to="/sign-up" class="item">{{ $t('sign_up') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
