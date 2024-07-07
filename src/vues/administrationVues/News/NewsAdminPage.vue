<script setup>
import {ref} from 'vue';
import HeaderComponent from '/src/components/HeaderAdmin.vue';
import FooterComponent from '/src/components/FooterComponent.vue';
import 'semantic-ui-css/semantic.min.css';
import {useRouter} from 'vue-router'

const apartments = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const error = ref(null);
const router = useRouter();
</script>

<template>
  <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent/>
    <div class="spacer"></div>
    <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
      <div v-if="error" class="ui negative message">{{ error }}</div>
      <div v-else>
        <table class="ui celled table">
          <thead>
          <tr>
            <!-- TODO: Add table headers here -->
          </tr>
          </thead>
          <tbody>
          <div class="ui two column grid">
            <router-link to="/new-house" class="column">
              <div class="ui fluid card">
                <div class="image">
                  <img src="/src/assets/newhouse.svg" alt="">
                </div>
                <div class="content">
                  <a class="header">Nouveau Bien</a>
                </div>
              </div>
            </router-link>
            <router-link to="/new-provider" class="column">
              <div class="ui fluid card">
                <div class="image">
                  <img src="/src/assets/newprovider.svg" alt="">
                </div>
                <div class="content">
                  <a class="header">Nouveau Service</a>
                </div>
              </div>
            </router-link>
          </div>
          </tbody>
        </table>
        <!-- TODO: Add more UI here -->
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>

<style scoped>
.spacer {
  margin-top: 12%;
}
</style>
