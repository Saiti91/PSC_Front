import { createApp } from 'vue';
import App from './App.vue';
import router from './routers/router.js'; // Importez votre routeur
//import cors from 'cors';


const app = createApp(App);

// app.use(cors({
//     origin: 'http://localhost:5173', // Votre application Vue.js
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     exposedHeaders: ['Authorization']
// }));
app.use(router); // Utilisez le routeur

app.mount('#app');
