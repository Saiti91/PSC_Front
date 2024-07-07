import axios from 'axios';
import Cookies from 'js-cookie';
import {useRouter} from 'vue-router';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:80',
});

axiosInstance.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            // Utilisez useRouter pour rediriger vers la page de connexion
            const router = useRouter();
            router.push('/login');
        }
        if (error.response && error.response.status === 401) {
            // Utilisez useRouter pour rediriger vers la page de connexion
            const router = useRouter();
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
