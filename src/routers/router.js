import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vues/LoginPage.vue';
import AccueilPage from '../vues/AccueilPage.vue'; // Assurez-vous que le chemin est correct

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/accueil', name: 'Accueil', component: AccueilPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
