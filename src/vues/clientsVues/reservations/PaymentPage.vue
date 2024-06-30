<script setup>
import HeaderComponent from '../../../components/HeaderComponent.vue';
import FooterComponent from '../../../components/FooterComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from "@/utils/Axios.js";

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const paymentError = ref(null);
const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();

const reservationDetails = ref({
  apartment_id: route.query.apartment_id,
  startDate: route.query.startDate,
  endDate: route.query.endDate,
  services: Array.isArray(route.query.services) ? route.query.services : (route.query.services ? route.query.services.split(',') : []),
  totalPrice: route.query.totalPrice
});

const setupStripe = async () => {
  try {
    stripe.value = await loadStripe('pk_test_51PX7r7FYikej8zQ9TWuGDqr9ew7vxrMC1QNZIAlQZRnDHtJChmlkURIWO2k7NqXY4dLSqxYx3jJOx9o7clWPjEKe00gJ3nq1uY');
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
      amount: reservationDetails.value.totalPrice * 100, // Le montant en centimes
    });

    if (response.data.success) {
      localStorage.setItem('reservationDetails', JSON.stringify(reservationDetails.value));
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

onMounted(() => {
  setupStripe();
});
</script>

<template>
  <div class="ui container">
    <HeaderComponent />
    <div class="spacer"></div>
    <div class="ui segment">
      <h2 class="ui header">Page de Paiement</h2>
      <form @submit.prevent="handleSubmit" class="ui form">
        <div class="field">
          <label for="card-element">Informations de Carte</label>
          <div id="card-element" class="ui segment"></div>
        </div>
        <button type="submit" class="ui primary button" :class="{ loading: isSubmitting }" :disabled="isSubmitting">Payer</button>
      </form>
      <div v-if="paymentError" class="ui negative message">
        <p>{{ paymentError }}</p>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.ui.container {
  margin-top: 50px;
}

.ui.segment {
  padding: 40px;
}

.field {
  margin-bottom: 20px;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
