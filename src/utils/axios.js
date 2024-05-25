//axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:80',
});

axiosInstance.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token ajouté à l'en-tête:", config.headers.Authorization);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
