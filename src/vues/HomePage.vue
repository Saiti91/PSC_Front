<!-- MainComponent.vue -->
<script setup>
import HeaderComponent from '../components/HeaderComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';

</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />

    <div class="ui basic segment flex-fill" style="flex: 1;">
      <h1 class="ui header">{{$t('home')}}</h1>
    </div>

    <FooterComponent />
  </div>
</template>


<style scoped>
.full-width {
  width: 100% !important;
}

.flex-fill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui.footer .list {
  color: #ccc !important; /* Lighter grey for links to be less prominent than main text */
}
</style>
