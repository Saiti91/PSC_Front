// src/routers/Router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '/src/vues/LoginPage.vue';
import AccueilPage from '/src/vues/clientsVues/HomePage.vue';
import AccueilAdminPage from '/src/vues/administrationVues/HomeAdminPage.vue';
import ServiceAdminPage from '/src/vues/administrationVues/Services/ServicesAdminPage.vue';
import UserAdminPage from '/src/vues/administrationVues/Users/UsersAdminPage.vue';
import useAuthGuard from '/src/components/Auth/AuthGuard.js';
import AddUser from '/src/vues/administrationVues/Users/AddUserPage.vue';
import UserDetails from '/src/vues/administrationVues/Users/UserDetailsPage.vue';
import ApartmentAdmin from '/src/vues/administrationVues/Apartments/ApartmentAdminPage.vue';
import SignUpPage from '/src/vues/clientsVues/SignUpPage.vue';
const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/', name: 'Accueil', component: AccueilPage },

    {
        path: '/accueil-admin',
        name: 'AccueilAdmin',
        component: AccueilAdminPage,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    {
        path: '/addUser',
        name: 'AddUser',
        component: AddUser,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    // path: '/le nom du service que tu appelera dans ta page',
    // name: 'nom de la page ex: ServiceAdmin',
    // component: la variable que tu import en haud du fichier router,
    // beforeEnter: useAuthGuard(['role_1', 'role_2', 'etc...'])
    {
        path: '/service-admin',
        name: 'ServiceAdmin',
        component: ServiceAdminPage,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    {
        path: '/user-admin',
        name: 'UserAdmin',
        component: UserAdminPage,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    {
        path: '/apartment-admin',
        name: 'ApartmentAdmin',
        component: ApartmentAdmin,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    {
        path: '/user/:id',
        name: 'UserDetails',
        component: UserDetails,
        beforeEnter: useAuthGuard(['admin','staff'])
    },
    {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUpPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
