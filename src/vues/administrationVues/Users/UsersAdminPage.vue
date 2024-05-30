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
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const userIdToDelete = ref(null);
const deletedUserDetails = ref({});
const selectedRole = ref('');

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

const filteredUsers = computed(() => {
  if (!selectedRole.value) {
    return users.value;
  }
  return users.value.filter(user => user.role === selectedRole.value);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value));

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

const openDeleteModal = (userId) => {
  userIdToDelete.value = userId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    const user = users.value.find(u => u.users_id === userIdToDelete.value);
    await axiosInstance.delete(`/users/${userIdToDelete.value}/`);
    deletedUserDetails.value = { id: user.users_id, role: user.role, email: user.email };
    await fetchUsers(); // Refresh the list after deletion
    showDeleteModal.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    error.value = 'Failed to delete the user.';
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
        <div class="ui right aligned">
          <div class="custom-dropdown">
            <select v-model="selectedRole">
              <option value="">{{$t('all_roles')}}</option>
              <option value="admin">{{$t('admin')}}</option>
              <option value="customer">{{ $t('customer') }}</option>
              <option value="provider">{{ $t('provider') }}</option>
              <option value="owner">{{ $t('owner') }}</option>
              <option value="staff">{{ $t('staff') }}</option>
            </select>
          </div>
          <button class="ui primary button" @click="navigateToAddUser">
            <i class="plus icon"></i>
          </button>
        </div>
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
              <button class="ui icon button" @click="openDeleteModal(user.users_id)">
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

    <!-- Custom Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">{{$t('delete_user')}}</div>
        <div class="modal-body">
          <p>{{$t('confirm_delete_user')}}</p>
        </div>
        <div class="modal-actions">
          <button class="ui button" @click="showDeleteModal = false">{{$t('cancel')}}</button>
          <button class="ui button red" @click="confirmDelete">{{$t('delete')}}</button>
        </div>
      </div>
    </div>

    <!-- Custom Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">Suppression réussie</div>
        <div class="modal-body">
          <p>L'utilisateur a été supprimé avec succès.</p>
          <p><strong>ID:</strong> {{ deletedUserDetails.id }}</p>
          <p><strong>Rôle:</strong> {{ deletedUserDetails.role }}</p>
          <p><strong>Email:</strong> {{ deletedUserDetails.email }}</p>
        </div>
        <div class="modal-actions">
          <button class="ui button" @click="showSuccessModal = false">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}
.custom-dropdown {
  display: inline-block;
  position: relative;
}

.custom-dropdown select {
  display: block;
  width: 150px; /* Ajustez la largeur selon vos besoins */
  padding: 10px; /* Ajouter du padding pour l'apparence */
  font-size: 14px; /* Ajuster la taille de la police */
  border: 1px solid #ccc; /* Bordure pour une meilleure visibilité */
  border-radius: 4px; /* Bordure arrondie pour une apparence moderne */
  appearance: none; /* Supprimer l'apparence par défaut du navigateur */
  -webkit-appearance: none; /* Supprimer l'apparence par défaut du navigateur pour Safari */
  -moz-appearance: none; /* Supprimer l'apparence par défaut du navigateur pour Firefox */
  background: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z' fill='%23666'/%3E%3C/svg%3E") no-repeat right 10px center; /* Icône de la flèche vers le bas */
  background-color: white; /* Couleur de fond blanche */
  background-size: 12px; /* Taille de l'icône */
}

.custom-dropdown::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 15px;
  width: 0;
  height: 0;
  pointer-events: none;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-container .ui.right.aligned {
  display: flex;
  align-items: center;
}

.header-container .ui.right.aligned .ui.dropdown {
  margin-right: 10px;
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
  width: 100%;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  font-size: 20px;
  margin-bottom: 10px;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
