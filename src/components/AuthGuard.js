import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyToken = () => {
            const token = Cookies.get('token');
            console.log("AuthGuard: Token encontrado ->", token);
            if (token) {
                // Si el token existe, se permite el acceso
                setIsVerified(true);
            } else {
                // Si no existe el token, se redirige al login
                console.log("AuthGuard: No se encontró token, redirigiendo al login");
                router.push('/login');
            }
        };

        verifyToken(); // Verificar token en el montaje
    }, [router.pathname]); // Ejecutar efecto en cada cambio de ruta

    // Mientras verifica el token, no muestra nada
    if (!isVerified) return null;

    // Si el usuario está verificado, renderiza el contenido protegido
    return <>{children}</>;
};

export default AuthGuard;
