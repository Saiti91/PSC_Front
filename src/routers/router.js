// router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vues/LoginPage.vue';
import AccueilPage from '../vues/AccueilPage.vue';
import AccueilAdminPage from '../vues/administrationVues/AcceuilAdminPage.vue';
import ServiceAdminPage from '../vues/administrationVues/servicesAdminPage.vue'; // Assurez-vous que le chemin est correct
import UserAdminPage from '../vues/administrationVues/usersAdminPage.vue'; // Assurez-vous que le chemin est correct

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/accueil', name: 'Accueil', component: AccueilPage },
    { path: '/accueil-admin', name: 'AccueilAdmin', component: AccueilAdminPage },
    { path: '/service-admin', name: 'ServiceAdmin', component: ServiceAdminPage },
    { path: '/user-admin', name: 'UserAdmin', component: UserAdminPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
