<script setup>
import {computed, onMounted, ref} from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import axiosInstance from '/src/utils/Axios.js';
import 'semantic-ui-css/semantic.min.css';
import {useRouter} from 'vue-router';

const apartments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);
const router = useRouter();
const showDeleteModal = ref(false);
const showSuccessModal = ref(false);
const apartmentIdToDelete = ref(null);
const deletedApartmentDetails = ref({});
const selectedType = ref('');

const parseStringArray = (stringArray) => {
  // Removing the curly braces and splitting by comma
  return stringArray.replace(/{|}/g, '').split(',');
};

const fetchApartments = async () => {
  error.value = null;
  try {
    const response = await axiosInstance.get('/apartments');
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    apartments.value = response.data.map(apartment => ({
      apartments_id: apartment.apartments_id,
      created_at: apartment.created_at.split('T')[0],
      surface: apartment.surface,
      capacity: apartment.capacity,
      available: apartment.available,
      apartment_type: apartment.apartment_type,
      numberofroom: apartment.numberofroom,
      pool: apartment.pool,
      price: apartment.price,
      owner_email: apartment.owner_email,
      number: apartment.number,
      addressComplement: apartment.addressComplement,
      building: apartment.building,
      apartmentNumber: apartment.apartmentNumber,
      street: apartment.street,
      CP: apartment.CP,
      town: apartment.town,
      images: parseStringArray(apartment.images),
      features: parseStringArray(apartment.features)
    }));
  } catch (err) {
    error.value = err.message;
  }
};

const filteredApartments = computed(() => {
  if (!selectedType.value) {
    return apartments.value;
  }
  return apartments.value.filter(apartment => apartment.apartment_type === selectedType.value);
});

const paginatedApartments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredApartments.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredApartments.value.length / pageSize.value));

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

const viewApartmentDetails = (apartmentId) => {
  router.push(`/apartment/${apartmentId}`);
};

const openDeleteModal = (apartmentId) => {
  apartmentIdToDelete.value = apartmentId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    const apartment = apartments.value.find(a => a.apartments_id === apartmentIdToDelete.value);
    await axiosInstance.delete(`/apartments/${apartmentIdToDelete.value}/`);
    deletedApartmentDetails.value = {
      id: apartment.apartments_id,
      type: apartment.apartment_type,
      email: apartment.owner_email
    };
    await fetchApartments(); // Refresh the list after deletion
    showDeleteModal.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    error.value = 'Failed to delete the apartment.';
  }
};

onMounted(fetchApartments);
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <div class="header-container">
        <h1 class="ui header">Gestion des Appartements</h1>
        <div class="ui right aligned">
          <div class="custom-dropdown">
            <select v-model="selectedType">
              <option value="">Tous les types</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <table class="ui celled table auto-layout">
          <thead>
          <tr>
            <th>Date de Création</th>
            <th>Surface</th>
            <th>Capacité</th>
            <th>Disponible</th>
            <th>Type</th>
            <th>Fonctionnalités</th>
            <th>Nombre de Pièces</th>
            <th>Prix</th>
            <th>Email Propriétaire</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="apartment in paginatedApartments" :key="apartment.apartments_id">
            <td>{{ apartment.created_at }}</td>
            <td>{{ apartment.surface }} m²</td>
            <td>{{ apartment.capacity }}</td>
            <td>{{ apartment.available ? 'Oui' : 'Non' }}</td>
            <td>{{ apartment.apartment_type }}</td>
            <td>{{ apartment.features.join(', ') }}</td>
            <td>{{ apartment.numberofroom }}</td>
            <td>{{ apartment.price }} €</td>
            <td>{{ apartment.owner_email }}</td>
            <td>
              <button class="ui icon button" @click="viewApartmentDetails(apartment.apartments_id)">
                <i class="eye icon"></i>
              </button>
              <button class="ui icon button" @click="openDeleteModal(apartment.apartments_id)">
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
            <label>Appartements par page</label>
            <select class="ui dropdown narrow-dropdown" v-model="pageSize" @change="fetchApartments">
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          <div class="ui pagination menu">
            <a class="item" @click="prevPage" :class="{disabled: currentPage === 1}">Précédent</a>
            <div class="item">Page {{ currentPage }}</div>
            <a class="item" @click="nextPage" :class="{disabled: currentPage === totalPages}">Suivant</a>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>

    <!-- Custom Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">Supprimer l'appartement</div>
        <div class="modal-body">
          <p>Voulez-vous vraiment supprimer cet appartement ?</p>
        </div>
        <div class="modal-actions">
          <button class="ui button" @click="showDeleteModal = false">Annuler</button>
          <button class="ui button red" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Custom Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">Suppression réussie</div>
        <div class="modal-body">
          <p>L'appartement a été supprimé avec succès.</p>
          <p><strong>ID:</strong> {{ deletedApartmentDetails.id }}</p>
          <p><strong>Type:</strong> {{ deletedApartmentDetails.type }}</p>
          <p><strong>Email:</strong> {{ deletedApartmentDetails.email }}</p>
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

/* Add this class */
.auto-layout {
  table-layout: auto;
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
