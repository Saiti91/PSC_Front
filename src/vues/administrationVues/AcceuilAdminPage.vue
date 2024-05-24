<!-- MainComponent.vue -->
<script setup>
import HeaderComponent from '/src/components/HeaderAdmin.vue'
import FooterComponent from '/src/components/FooterComponent.vue'
</script>

<template>
  <div class="container">
    <HeaderComponent />
    <div class="content">
      <h1>Accueil Admin</h1>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgrey;
}

h1 {
  font-size: 3em;
}
</style>
é