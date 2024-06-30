<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue';
import FooterComponent from '../../components/FooterComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="payment-success">
    <HeaderComponent />
    <div class="content">
      <h1>Paiement Réussi</h1>
      <p>Merci pour votre paiement ! Votre transaction a été complétée avec succès.</p>
      <p>Nous vous enverrons un email de confirmation sous peu.</p>
      <button @click="goHome">Retour à l'accueil</button>
    </div>
    <FooterComponent />
  </div>
</template>


<style scoped>
.payment-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.content {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

h1 {
  color: #4CAF50;
}
</style>
