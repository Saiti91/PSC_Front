// src/router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vues/LoginPage.vue';
import AccueilPage from '../vues/AccueilPage.vue';
import AccueilAdminPage from '../vues/administrationVues/AcceuilAdminPage.vue';
import ServiceAdminPage from '../vues/administrationVues/servicesAdminPage.vue';
import UserAdminPage from '../vues/administrationVues/usersAdminPage.vue';
import { authGuard } from '/src/components/Auth/AuthGuard.js';

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/accueil', name: 'Accueil', component: AccueilPage },
    { path: '/accueil-admin', name: 'AccueilAdmin', component: AccueilAdminPage, beforeEnter: authGuard('admin') },
    { path: '/service-admin', name: 'ServiceAdmin', component: ServiceAdminPage, beforeEnter: authGuard('admin') },
    { path: '/user-admin', name: 'UserAdmin', component: UserAdminPage, beforeEnter: authGuard('admin') }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
