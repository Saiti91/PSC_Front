// src/router/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vues/LoginPage.vue';
import AccueilPage from '../vues/AccueilPage.vue';
import AccueilAdminPage from '/src/vues/administrationVues/AccueilAdminPage.vue';
import ServiceAdminPage from '/src/vues/administrationVues/ServicesAdminPage.vue';
import UserAdminPage from '/src/vues/administrationVues/UsersAdminPage.vue';
import useAuthGuard from '/src/components/Auth/AuthGuard.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Login', component: LoginPage },
        { path: '/accueil', name: 'Accueil', component: AccueilPage },
        {
            path: '/accueil-admin',
            name: 'AccueilAdmin',
            component: AccueilAdminPage,
            beforeEnter: useAuthGuard(['admin'])
        },
        {
            path: '/service-admin',
            name: 'ServiceAdmin',
            component: ServiceAdminPage,
            beforeEnter: useAuthGuard(['admin'])
        },
        {
            path: '/user-admin',
            name: 'UserAdmin',
            component: UserAdminPage,
            beforeEnter: useAuthGuard(['admin'])
        }
    ]
});

export default router;
