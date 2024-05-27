<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/axios.js';
import 'semantic-ui-css/semantic.min.css';
import { useRouter } from 'vue-router'

const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);
const router = useRouter();

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

const navigateToAddUser = () => {
  router.push('/AddUser');
};

const viewUserDetails = (userId) => {
  router.push(`/user/${userId}`);
};

const deleteUser = async (userId) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      fetchUsers(); // Refresh the list after deletion
    } catch (err) {
      error.value = 'Failed to delete the user.';
    }
  }
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
        <button class="ui primary button" @click="navigateToAddUser">
          <i class="plus icon"></i>
        </button>
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
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in paginatedUsers" :key="user.users_id">
            <td>{{ user.users_id }}</td>
            <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="ui icon button" @click="viewUserDetails(user.users_id)">
                <i class="eye icon"></i>
              </button>
              <button class="ui icon button" @click="deleteUser(user.users_id)">
                <i class="trash icon"></i>
              </button>
              <button class="ui icon button">
                <i class="ellipsis horizontal icon"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="pagination-settings">
          <div class="items-per-page">
            <label>{{$t('users_per_page')}}</label>
            <select class="ui dropdown narrow-dropdown" v-model="pageSize" @change="fetchUsers">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div class="ui pagination menu">
            <a class="item" @click="prevPage" :class="{disabled: currentPage === 1}">{{$t('previous')}}</a>
            <div class="item">Page {{ currentPage }}</div>
            <a class="item" @click="nextPage" :class="{disabled: currentPage === totalPages}">{{$t('next')}}</a>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}

.ui.container {
  max-width: 1000px;
  margin: 0 auto; /* Centrer le conteneur horizontalement */
  padding-bottom: 50px; /* Assurez-vous qu'il y a suffisamment d'espace en bas pour le footer */
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui.form .field {
  width: 100%;
}

.ui.icon.button {
  margin: 0 5px;
}

.pagination-settings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.items-per-page {
  display: flex;
  align-items: center;
}

.items-per-page label {
  margin-right: 10px;
}

.ui.pagination.menu {
  display: flex;
  align-items: center;
}

.footer {
  width: 100%;
  background-color: #333 !important;
  color: #fff !important;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1em 0;
  text-align: center;
}


</style>
