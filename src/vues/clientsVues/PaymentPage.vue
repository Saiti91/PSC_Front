<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from "@/utils/Axios.js";

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const paymentError = ref(null);
const isSubmitting = ref(false);
const router = useRouter();

const setupStripe = async () => {
  try {
    stripe.value = await loadStripe('pk_test_51PX7r7FYikej8zQ9TWuGDqr9ew7vxrMC1QNZIAlQZRnDHtJChmlkURIWO2k7NqXY4dLSqxYx3jJOx9o7clWPjEKe00gJ3nq1uY'); // Remplace par ta clé de publication de test
    elements.value = stripe.value.elements();
    cardElement.value = elements.value.create('card');
    cardElement.value.mount('#card-element');
  } catch (error) {
    console.error('Erreur lors de la configuration de Stripe:', error);
    paymentError.value = 'Erreur lors de la configuration de Stripe.';
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  paymentError.value = null;
  try {
    const { error, paymentMethod } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: cardElement.value,
    });

    if (error) {
      paymentError.value = error.message;
      isSubmitting.value = false;
      return;
    }

    const response = await axiosInstance.post('/stripe/charge', {
      paymentMethodId: paymentMethod.id,
    });

    if (response.data.success) {
      router.push('/payment-success');
    } else {
      paymentError.value = 'Erreur lors du traitement du paiement';
    }
  } catch (err) {
    paymentError.value = err.response ? err.response.data.error : err.message;
  } finally {
    isSubmitting.value = false;
  }
};

setupStripe();
</script>



<template>
  <div>
    <HeaderComponent />
    <div class="spacer"></div>
    <form @submit.prevent="handleSubmit">
      <div id="card-element"></div>
      <button type="submit" :disabled="isSubmitting">Payer</button>
    </form>
    <div v-if="paymentError">{{ paymentError }}</div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 10%;
}
</style>
