<!-- AddServiceType.vue -->
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const newServiceType = ref({ name: '' });

const addServiceType = async () => {
  await axios.post('/services/type', {
    name: newServiceType.value.name
  });
};
</script>

<template>
  <div class="ui container">
    <h2 class="ui header">Ajouter un nouveau type de service</h2>
    <form class="ui form" @submit.prevent="addServiceType">
      <div class="field">
        <label>Nom du Type de Service</label>
        <input type="text" v-model="newServiceType.name" required />
      </div>
      <button type="submit" class="ui button primary">Ajouter Type de Service</button>
    </form>
  </div>
</template>

<style scoped>
.ui.container {
  margin-top: 2rem;
}
</style>
