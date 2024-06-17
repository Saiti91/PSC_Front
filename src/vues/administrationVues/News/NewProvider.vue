<script setup>
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer-top"></div>
    <div class="ui centered grid" style="flex-grow: 1; align-items: center;">
      <div class="ui three column centered grid">
        <div class="column">
          <div class="ui card" @click="$router.push('/add-provider')">
            <div class="image">
              <!-- Ajouter l'image ici plus tard -->
            </div>
            <div class="content">
              <a class="header">Ajouter une Entreprise</a>
              <div class="description">
                Créez une nouvelle entreprise et ajoutez ses services.
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="ui card" @click="$router.push('/add-serviceToProvider')">
            <div class="image">
              <!-- Ajouter l'image ici plus tard -->
            </div>
            <div class="content">
              <a class="header">Ajouter un Service</a>
              <div class="description">
                Ajoutez des services à une entreprise existante.
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="ui card" @click="$router.push('/add-serviceType')">
            <div class="image">
              <!-- Ajouter l'image ici plus tard -->
            </div>
            <div class="content">
              <a class="header">Ajouter un Type de Service</a>
              <div class="description">
                Ajoutez de nouveaux types de services à la base de données.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="spacer-bottom"></div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer-top {
  margin-top: 10%;
}

.spacer-bottom {
  margin-bottom: 5%;
}

.ui.card {
  cursor: pointer;
}

.ui.card .image {
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui.card .image img {
  max-width: 100%;
  max-height: 100%;
}
</style>
