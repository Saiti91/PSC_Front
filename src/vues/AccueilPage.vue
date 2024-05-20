<script setup>
// Pas de script nécessaire pour cette page pour l'instant
</script>

<template>
  <div class="container">
    <div class="header"></div>
    <div class="content">
      <h1>Accueil</h1>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header, .footer {
  height: 50px;
  background-color: grey;
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
