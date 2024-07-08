<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import 'semantic-ui-css/semantic.min.css';

const router = useRouter();
const route = useRoute();
const activeRoute = ref(route.path);

router.afterEach((to) => {
  activeRoute.value = to.path;
});

const isRouteActive = (route) => activeRoute.value === route;
</script>

<template>
  <div class="ui vertical menu account-menu">
    <router-link to="/my-details" class="item" :class="{ active: isRouteActive('/my-details') }">
      <i class="user icon"></i>
      {{ $t('my-details') }}
    </router-link>
    <!--
    <router-link to="/my-subscription" class="item" :class="{ active: isRouteActive('/my-subscription') }">
      <i class="credit card icon"></i>
      {{ $t('my-subscription') }}
    </router-link>
    -->
    <router-link to="/my-past-bookings" class="item" :class="{ active: isRouteActive('/my-past-bookings') }">
      <i class="history icon"></i>
      {{ $t('my-past-bookings') }}
    </router-link>
    <router-link to="/my-future-bookings" class="item" :class="{ active: isRouteActive('/my-future-bookings') }">
      <i class="calendar icon"></i>
      {{ $t('my-futur-bookings') }}
    </router-link>
    <router-link to="/my-housing" class="item" :class="{ active: isRouteActive('/my-housing') }">
      <i class="home icon"></i>
      {{ $t('my-housing') }}
    </router-link>
  </div>
</template>

<style scoped>
.account-menu {
  width: 20%;
  max-width: 200px; /* Limite la largeur du menu */
  padding: 15px;
  background-color: #f4f4f4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 100vh; /* Prend toute la hauteur de la page */
}

.ui.vertical.menu {
  width: 100%; /* Prend la largeur complète du menu */
}

.ui.vertical.menu .item.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.ui.vertical.menu .item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
}

.ui.vertical.menu .item i.icon {
  margin-right: 10px; /* Espacement entre l'icône et le texte */
}
</style>
