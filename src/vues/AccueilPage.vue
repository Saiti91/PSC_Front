<!-- MainComponent.vue -->
<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';

</script>

<template>
  <div class="ui container" style="height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />

    <div class="ui basic segment flex-fill" style="display: flex; justify-content: center; align-items: center;">
      <h1 class="ui header">Accueil</h1>
    </div>

    <FooterComponent />
  </div>
</template>

<style scoped>
.flex-fill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
