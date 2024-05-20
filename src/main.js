import { createApp } from 'vue';
import App from './App.vue';
import router from './routers/router.js'; // Importez votre routeur

const app = createApp(App);

app.use(router); // Utilisez le routeur

app.mount('#app');
