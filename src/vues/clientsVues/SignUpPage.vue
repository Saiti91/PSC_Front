<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import 'semantic-ui-css/semantic.min.css';
import axiosInstance from "@/utils/Axios.js";

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const last_name = ref('');
const first_name = ref('');
const message = ref(false);


const submitForm = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = true;
    console.log("mauvais mot de passe")
    return;
  }
  try {
    const payload = {
      email: email.value,
      password: password.value, // Assurez-vous de générer un mot de passe sécurisé en production
      first_name: first_name.value,
      last_name: last_name.value,
      role: "customer"
    };

    const response = await fetch('http://localhost:80/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    router.push('/login');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
</script>

<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        <div class="content">{{ $i18n.t('account_creation') }}</div>
      </h2>
      <form class="ui large form" @submit.prevent="submitForm">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="first_name" name="first_name" :placeholder="$t('first-name')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="last_name" name="last_name" :placeholder="$t('last-name')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="mail icon"></i>
              <input type="email" v-model="email" name="email" :placeholder="$t('email')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" name="password" :placeholder="$t('password')" required>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="confirmPassword" name="confirmPassword" :placeholder="$t('confirm_password')" required>
            </div>
          </div>
          <button class="ui fluid large teal submit button" type="submit">{{ $t('sign_up') }}</button>
        </div>

        <template v-if="message.value === true">
          <div class="ui error message">{{ $t('pwd-dont-match') }}</div>
        </template>
      </form>
      <div class="ui message">{{ $t('older_to_us') }}
        <router-link to="/login" class="item">{{ $t('login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
