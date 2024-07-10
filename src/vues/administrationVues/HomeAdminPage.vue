<script setup>
import HeaderComponent from '/src/components/HeaderAdmin.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';
</script>

<template>
  <div class="ui container" style="height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>

    <div class="ui basic segment flex-grow" style="display: flex; justify-content: center; align-items: center;">
      <h1 class="ui center aligned icon header">
        <i class="cogs icon"></i>
        {{ $t('admin_home') }}
      </h1>
    </div>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.flex-grow {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
</style>
