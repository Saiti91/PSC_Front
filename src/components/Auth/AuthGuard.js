// src/components/Auth/AuthGuard.js
import { ref } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';
import { useRouter } from 'vue-router';

export default function useAuthGuard(permittedRoles) {
  return (to, from, next) => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = VueJwtDecode.decode(token);
        const userRole = decodedToken.urole; // assuming the role is stored in 'urole'
        const isAuthenticated = permittedRoles.includes(userRole);
        if (!isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      } catch (error) {
        console.error('Invalid token', error);
        next('/login');
      }
    } else {
      next('/login');
    }
  };
}
