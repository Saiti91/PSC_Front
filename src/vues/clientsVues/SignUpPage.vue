<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import 'semantic-ui-css/semantic.min.css';
import axiosInstance from "@/utils/Axios.js";
import { useI18n } from 'vue-i18n'; // Importation de useI18n

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const last_name = ref('');
const first_name = ref('');
const message = ref(false);
const error = ref(null);
const success = ref(null);

const { t } = useI18n(); // Obtenir la fonction t pour les traductions


const submitForm = async () => {

  error.value = null;
  success.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = t('pwd-dont-match');
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

    const response = await fetch('http://localhost:80/auth/register/', {
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
    Console.log("error");
  }
}
</script>

<template>
  <div class="ui middle aligned center aligned grid" style="height: 100vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        <div class="content">{{ $i18n.t('account_creation') }}</div>
      </h2>
      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-if="success" class="ui positive message">{{ success }}</div>
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
      </form>
      <div class="ui message">{{ $t('older_to_us') }}
        <router-link to="/login" class="item">{{ $t('login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
