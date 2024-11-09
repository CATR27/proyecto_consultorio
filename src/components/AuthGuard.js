import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyAccess = () => {
            const token = Cookies.get('token');
            const rol = Cookies.get('rol'); // Obtener el rol del usuario

            if (token) {
                // Si el usuario tiene un token, verificar el rol
                if (rol === 'administrador' && router.pathname !== '/dashboard-admin') {
                    router.push('/dashboard-admin');
                } else if (rol === 'paciente' && router.pathname !== '/dashboard-paciente') {
                    router.push('/dashboard-paciente');
                } else {
                    setIsVerified(true); // Usuario tiene acceso a esta ruta
                }
            } else {
                // Si no existe el token, redirigir al login
                router.push('/login');
            }
        };

        verifyAccess(); // Verificar acceso en el montaje del componente
    }, [router.pathname]);

    if (!isVerified) return null;

    return <>{children}</>;
};

export default AuthGuard;
