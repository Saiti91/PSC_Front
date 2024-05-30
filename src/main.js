import { createApp } from 'vue';
import App from './App.vue';
import router from './routers/router.js'; // Importez votre routeur
import i18n from './i18n';



const app = createApp(App);
app.use(router); // Utilisez le routeur
app.use(i18n);

app.mount('#app');
