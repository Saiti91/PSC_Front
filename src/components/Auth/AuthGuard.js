// AuthGuard.js
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import { useRouter } from 'vue-router';

export default function useAuthGuard(permittedRoles) {
  const isAuthenticated = ref(false);
  const router = useRouter();
  const userRole = ref(null);

  const checkAuth = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = VueJwtDecode.decode(token);
        userRole.value = decodedToken.urole;
        isAuthenticated.value = permittedRoles.includes(userRole.value);
        if (!isAuthenticated.value) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Invalid token', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  onMounted(checkAuth);
  return { isAuthenticated, userRole };
}
