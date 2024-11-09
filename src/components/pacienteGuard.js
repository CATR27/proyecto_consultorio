// src/components/PacienteGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PacienteGuard = ({ children }) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyRole = () => {
            const token = Cookies.get('token');
            const rol = Cookies.get('rol'); // Supongamos que guardamos el rol en una cookie
            if (token && rol === 'paciente') {
                setIsVerified(true);
            } else {
                router.push('/login');
            }
        };

        verifyRole();
    }, [router.pathname]);

    if (!isVerified) return null;

    return <>{children}</>;
};

export default PacienteGuard;
