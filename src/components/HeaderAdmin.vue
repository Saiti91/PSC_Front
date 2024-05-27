<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import axiosInstance from '../utils/axios.js'; // Assurez-vous que le chemin est correct
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import 'semantic-ui-css/semantic.min.css';

// i18n setup
const { locale, availableLocales } = useI18n();

const changeLocale = (lang) => {
  locale.value = lang;
};

const currentLocale = computed(() => locale.value);

// Component setup
const services = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/services');
    services.value = response.data;
  } catch (error) {
    console.error('Error loading services', error);
  }
});

function logout() {
  Cookies.remove('token');
  router.push('/');
}
</script>

<template>
  <div class="ui top fixed menu">
    <div class="ui container">
      <router-link to="/" class="header item logo-container">
        <img class="logo" src="/src/assets/logo.svg" alt="Company Logo"> {{ $t('admin_DashBoard')}}
      </router-link>
      <div class="right menu">
        <router-link to="/service-admin" class="item">{{ $t('services') }}</router-link>
        <router-link to="/user-admin" class="item">{{ $t('users') }}</router-link>
        <router-link to="/admin/settings" class="item">{{ $t('settings') }}</router-link>
        <a class="item" @click="logout">{{$t('logout')}}</a>
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
