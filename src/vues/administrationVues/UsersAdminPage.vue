<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/axios.js';
import 'semantic-ui-css/semantic.min.css';
import AddUser from "@/vues/administrationVues/addUser.vue";
import { useRouter } from 'vue-router'

const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);

const fetchUsers = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/users');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users.value = response.data;
  } catch (err) {
    error.value = err.message;
  }
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return users.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / pageSize.value));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const router = useRouter();

const navigateToAddUser = () => {
  router.push('/AddUser');
};

onMounted(fetchUsers);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div> <!-- Ajout d'un espace -->
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <div class="header-container">
        <h1 class="ui header">{{$t('user_administration')}}</h1>
        <button class="ui primary button" @click="navigateToAddUser">+</button>
      </div>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <table class="ui celled table">
          <thead>
          <tr>
            <th>ID</th>
            <th>{{$t('created_At')}}</th>
            <th>{{$t('first_Name')}}</th>
            <th>{{$t('last_Name')}}</th>
            <th>{{$t('roles')}}</th>
            <th>{{$t('email')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.users_id">
            <td>{{ user.users_id }}</td>
            <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.role}}</td>
            <td>{{ user.email }}</td>
          </tr>
          </tbody>
        </table>
        <div class="pagination-container">
          <div class="ui pagination menu">
            <a class="item" @click="prevPage" :class="{disabled: currentPage === 1}">{{$t('previous')}}</a>
            <div class="item">Page {{ currentPage }}</div>
            <a class="item" @click="nextPage" :class="{disabled: currentPage === totalPages}">{{$t('next')}}</a>
          </div>
          <div class="items-per-page">
            <label>{{$t('users_per_page')}}</label>
            <select class="ui dropdown narrow-dropdown" v-model="pageSize" @change="fetchUsers">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%; /* Ajustez la marge selon vos besoins */
}

.narrow-dropdown {
  width: auto !important;
  display: inline-block;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
}

.items-per-page {
  display: flex;
  align-items: center;
}

.items-per-page label {
  margin-right: 0.5em;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
