<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '/src/utils/Axios.js';
import HeaderComponent from "@/components/HeaderAdmin.vue";
import FooterComponent from "@/components/FooterComponent.vue";

const route = useRoute();
const userId = ref(route.params.id);
const user = ref(null);
const error = ref(null);

const fetchUserDetails = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get(`/users/${userId.value}/`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    user.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchUserDetails);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <h1 class="ui header">User Details</h1>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else-if="user">
        <div class="ui segment">
          <h2 class="ui header">{{ user.first_name }} {{ user.last_name }}</h2>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</p>
        </div>
      </div>
      <div v-else class="ui active inline loader"></div>
    </div>

    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.container {
  max-width: 800px;
  margin-top: 50px;
}

.ui.segment {
  margin-top: 20px;
}
</style>
