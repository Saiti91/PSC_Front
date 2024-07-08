<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import {useRouter} from 'vue-router';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import {ref} from "vue";

const router = useRouter();

const navigateTo = (routeName) => {
  router.push({name: routeName});
};

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

const log = () => {
  Cookies.remove('token');
  isAuthenticated.value = false;
  // Redirection ou autre logique après déconnexion
};
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui stackable grid" style="text-align: center;">
      <div class="sixteen wide column">
        <h1>{{ $t('join-us') }}</h1>
      </div>
      <div v-if="isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-trust-property') }}</h2>
          <button class="ui primary button" @click="navigateTo('Join-Housing')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-trust-property') }}</h2>
          <p>{{ $t('join-housing-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('Login')">{{ $t('login') }}</button>
        </div>
      </div>
      <div class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-work-us') }}</h2>
          <button class="ui primary button" @click="navigateTo('Join-Provider')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 20%;
}

.ui.segment {
  margin: 20px 0;
}

button.ui.primary.button {
  margin-top: 10px;
}
</style>