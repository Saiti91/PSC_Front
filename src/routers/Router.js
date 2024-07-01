// src/routers/Router.js
import {createRouter, createWebHistory} from 'vue-router';
import LoginPage from '/src/vues/LoginPage.vue';
import AccueilPage from '/src/vues/clientsVues/HomePage.vue';
import AccueilAdminPage from '/src/vues/administrationVues/HomeAdminPage.vue';
import ServiceAdminPage from '/src/vues/administrationVues/Services/ServicesAdminPage.vue';
import UserAdminPage from '/src/vues/administrationVues/Users/UsersAdminPage.vue';
import useAuthGuard from '/src/components/Auth/AuthGuard.js';
import AddUser from '/src/vues/administrationVues/Users/AddUserPage.vue';
import UserDetails from '/src/vues/administrationVues/Users/UserDetailsPage.vue';
import ApartmentDetails from '/src/vues/administrationVues/Apartments/ApartmentDetailsPage.vue';
import ApartmentAdmin from '/src/vues/administrationVues/Apartments/ApartmentAdminPage.vue';
import NewsAdmin from '/src/vues/administrationVues/News/NewsAdminPage.vue';
import NewHouse from '/src/vues/administrationVues/News/NewHouse.vue';
import NewProvider from '/src/vues/administrationVues/News/NewProvider.vue';
import SignUpPage from '/src/vues/clientsVues/SignUpPage.vue';
import CataloguePage from "/src/vues/clientsVues/CataloguePage.vue";
import HousingDetailsPage from "/src/vues/clientsVues/reservations/HousingDetailsPage.vue";

import AddProvider from "/src/vues/administrationVues/News/Provider/AddProvider.vue";
import AddServiceToProvider from "/src/vues/administrationVues/News/Provider/AddServiceToProvider.vue";
import AddServiceType from "/src/vues/administrationVues/News/Provider/AddServiceType.vue";
import PaymentPage from "/src/vues/clientsVues/reservations/PaymentPage.vue";
import PaymentSuccess from "/src/vues/clientsVues/reservations/PaymentSuccess.vue";
import BookingConfirmation from "/src/vues/clientsVues/reservations/BookingConfirmationPage.vue";
import OrderSummaryPage from "/src/vues/clientsVues/reservations/OrderSummaryPage.vue";
import JoinUsPage from "/src/vues/clientsVues/JoinUsPage.vue";
import JoinProviderPage from "/src/vues/clientsVues/JoinProviderPage.vue";
import JoinHousingPage from "/src/vues/clientsVues/JoinHousingPage.vue";

const routes = [
    {path: '/login', name: 'Login', component: LoginPage},
    {path: '/', name: 'Accueil', component: AccueilPage},
    {path: '/sign-up', name: 'Sign-Up', component: SignUpPage},
    {path: '/housing', name: 'Housing', component: CataloguePage},
    {path: '/payment', name: 'Payment', component: PaymentPage},
    {path: '/payment-success', name: 'Payment-Success', component: PaymentSuccess},
    {path: '/join-us', name: 'Join-Us', component: JoinUsPage},
    {path: '/join-provider', name: 'Join-Provider', component: JoinProviderPage},
    {path: '/join-housing', name: 'Join-Housing', component: JoinHousingPage},
    {path: '/housing/:id', name: 'HousingDetails', component: HousingDetailsPage},
    {
        path: '/order-summary',
        name: 'OrderSummary',
        component: OrderSummaryPage,
        beforeEnter: useAuthGuard(['admin', 'staff', 'customer', 'owner', 'provider'])
    },
    {
        path: '/add-provider',
        name: 'Add-Provider',
        component: AddProvider,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/booking-confirmation',
        name: 'BookingConfirmation',
        component: BookingConfirmation,
        beforeEnter: useAuthGuard(['admin', 'staff', 'customer', 'owner', 'provider'])
    },
    {
        path: '/add-serviceType',
        name: 'Add-ServiceType',
        component: AddServiceType,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/add-serviceToProvider',
        name: 'Add-serviceToProvider',
        component: AddServiceToProvider,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/accueil-admin',
        name: 'AccueilAdmin',
        component: AccueilAdminPage,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/addUser',
        name: 'AddUser',
        component: AddUser,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    // path: '/le nom du service que tu appelera dans ta page',
    // name: 'nom de la page ex: ServiceAdmin',
    // component: la variable que tu import en haud du fichier router,
    // beforeEnter: useAuthGuard(['role_1', 'role_2', 'etc...'])
    {
        path: '/service-admin',
        name: 'ServiceAdmin',
        component: ServiceAdminPage,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/user-admin',
        name: 'UserAdmin',
        component: UserAdminPage,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/apartment-admin',
        name: 'ApartmentAdmin',
        component: ApartmentAdmin,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/news-admin',
        name: 'NewsAdmin',
        component: NewsAdmin,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/new-house',
        name: 'NewHouse',
        component: NewHouse,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/new-provider',
        name: 'NewProvider',
        component: NewProvider,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/user/:id',
        name: 'UserDetails',
        component: UserDetails,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    },
    {
        path: '/apartment/:id',
        name: 'ApartmentDetails',
        component: ApartmentDetails,
        beforeEnter: useAuthGuard(['admin', 'staff'])
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
