<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

const {locale, availableLocales} = useI18n();

const changeLocale = (lang) => {
  locale.value = lang;
};

const currentLocale = computed(() => locale.value);

const token = Cookies.get('token');
const isAuthenticated = ref(false);

if (token) {
  try {
    const decodedToken = VueJwtDecode.decode(token);
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() < expirationTime) {
      isAuthenticated.value = true;
    } else {
      Cookies.remove('token');
    }
  } catch (error) {
    console.error('Invalid token', error);
    Cookies.remove('token');
  }
}

const logout = () => {
  Cookies.remove('token');
  isAuthenticated.value = false;
  // Redirection ou autre logique après déconnexion
  router.push('/');
};

</script>

<template>
  <div class="ui fixed menu">
    <div class="ui container">
      <router-link to="/" class="header item logo-container">
        <img class="logo" src="/src/assets/logo.svg" alt="Company Logo">
      </router-link>
      <div class="right menu">
        <router-link v-if="!isAuthenticated" to="/login" class="item">{{ $t('login') }}</router-link>
        <a v-if="isAuthenticated" @click="logout" class="item">{{ $t('logout') }}</a>
        <router-link to="/" class="item">{{ $t('home') }}</router-link>
        <router-link to="/housing" class="item">{{ $t('our-housing') }}</router-link>
        <router-link to="/join-us" class="item">{{ $t('join-us-btn') }}</router-link>
        <router-link to="" class="item">{{ $t('about') }}</router-link>
        <router-link to="" class="item">{{ $t('contact') }}</router-link>
        <div class="ui simple dropdown item">
          <i class="world icon"></i> {{ currentLocale }}
          <div class="menu">
            <div v-for="lang in availableLocales"
                 :key="lang"
                 class="item"
                 @click="changeLocale(lang)">
              {{ lang }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.ui.menu {
  background-color: #d9d9d9;
  border-radius: 0;
  border: none;
}

.logo-container {
  width: 200px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.logo {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
</style>
