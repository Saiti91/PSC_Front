<script setup>
import {onMounted, ref} from 'vue';
import {useLocale} from '/src/composables/useLocale.js';
import {useRouter} from 'vue-router';
import Cookies from 'js-cookie';
import 'semantic-ui-css/semantic.min.css';

// i18n setup
const {locale,availableLocales, changeLocale, currentLocale} = useLocale();

// Component setup
const router = useRouter();

onMounted(async () => {

});

function logout() {
  Cookies.remove('token');
  router.push('/');
}
</script>

<template>
  <div class="ui top fixed menu">
    <div class="ui container">
      <router-link class="header item logo-container" to="/">
        <img alt="Company Logo" class="logo" src="/src/assets/logo.svg"> {{ $t('admin_DashBoard') }}
      </router-link>
      <div class="right menu">
        <router-link class="item" to="/service-admin">{{ $t('services') }}</router-link>
        <router-link class="item" to="/user-admin">{{ $t('users') }}</router-link>
        <router-link class="item" to="/apartment-admin">{{ $t('apartment') }}</router-link>
        <router-link class="item" to="/news-admin">{{ $t('news') }}</router-link>
        <a class="item" @click="logout">{{ $t('logout') }}</a>
        <div class="ui simple dropdown item">
          <i class="world icon"></i> {{ currentLocale }}
          <div class="menu">
            <div
                v-for="lang in availableLocales"
                :key="lang"
                class="item"
                @click="changeLocale(lang)"
            >
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
  width: 250px;
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
