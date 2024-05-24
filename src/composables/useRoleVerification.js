import { ref } from 'vue';
import Cookies from 'js-cookie';
import VueJwtDecode from 'vue-jwt-decode';

export function useRoleVerification() {
    const userRole = ref(null);

    const verifyRole = (requiredRole) => {
        const token = Cookies.get('token');
        if (token) {
            const decodedToken = VueJwtDecode.decode(token);
            userRole.value = decodedToken.urole;
            if (decodedToken.urole !== requiredRole) {
                console.error('Access denied. User role:', decodedToken.urole);
                return false;
            }
            return true;
        } else {
            console.error('Token not found');
            return false;
        }
    };

    return {
        userRole,
        verifyRole
    };
}
