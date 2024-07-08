<script setup>
import AccountMenuComponent from "/src/components/AccountMenuComponent.vue";
import HeaderComponent from '/src/components/HeaderComponent.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import Swal from "sweetalert2";
import { ref, watch } from "vue";

// Données du formulaire
const formData = ref({
  lastName: "Doe",
  firstName: "John",
  email: "john.doe@example.com",
  password: "********",
});

const originalFormData = ref({ ...formData.value }); // Sauvegarde des données originales

const modifiedFields = ref([]);
const showSaveButton = ref(false);
const isEditing = ref(false);

// Vérifie si un champ a été modifié
const isModified = (field) => {
  return modifiedFields.value.includes(field);
};

// Commence l'édition des champs
const startEditing = () => {
  isEditing.value = true;
  showSaveButton.value = true;
};

// Soumet le formulaire
const submitForm = () => {
  // Enregistrement dans la BDD (simulé ici)
  saveChanges();
};

// Sauvegarde des modifications dans la base de données (simulé ici)
const saveChanges = () => {
  // Ici vous pouvez simuler une requête HTTP avec Axios ou autre
  // Dans notre exemple, nous allons simplement simuler un délai de 1 seconde
  setTimeout(() => {
    Swal.fire("Modifications enregistrées", "", "success");
    originalFormData.value = { ...formData.value }; // Mettre à jour les données originales
    modifiedFields.value = []; // Réinitialiser les champs modifiés
    showSaveButton.value = false;
    isEditing.value = false; // Terminer l'édition
  }, 1000);
};

// Vérifie les modifications lors de la saisie
watch(formData, (newValue, oldValue) => {
  modifiedFields.value = []; // Réinitialiser les champs modifiés
  for (const field in newValue) {
    if (newValue[field] !== originalFormData.value[field]) {
      modifiedFields.value.push(field);
    }
  }
  showSaveButton.value = modifiedFields.value.length > 0 && isEditing.value;
});
</script>

<template>
  <div>
    <HeaderComponent />
    <div class="account-container">
      <AccountMenuComponent />
      <div class="content-container">
        <div class="content">
          <h2>Informations personnelles</h2>
          <form @submit.prevent="submitForm" class="ui form">
            <div class="field">
              <label>Nom</label>
              <input v-model="formData.lastName" :readonly="!isEditing" type="text">
            </div>
            <div class="field">
              <label>Prénom</label>
              <input v-model="formData.firstName" :readonly="!isEditing" type="text">
            </div>
            <div class="field">
              <label>Adresse email</label>
              <input v-model="formData.email" :readonly="!isEditing" type="email">
            </div>
            <div class="field">
              <label>Mot de passe</label>
              <input v-model="formData.password" :readonly="!isEditing" type="password">
            </div>
            <div>
              <button v-if="!isEditing" class="ui button primary" @click="startEditing">Modifier</button>
              <button v-if="isEditing || showSaveButton" class="ui button primary" type="submit">Valider les modifications</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  margin-top: 70px; /* Ajuster pour la hauteur du header */
}

.content-container {
  flex: 1;
  padding: 20px;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 15px; /* Espacement entre les champs */
}

footer {
  margin-top: auto;
}
</style>
