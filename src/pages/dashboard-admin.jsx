import AuthGuard from '../components/AuthGuard'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const handleLogout = () => {
    Cookies.remove('token'); // Eliminar el token
    Cookies.remove('rol'); // Eliminar el rol (si está almacenado en una cookie)
    window.location.href = '/login'; // Redirigir al login
};

export default function DashboardAdmin() {
    return (
        <AuthGuard>
            <div>
                <h1>Dashboard de Administrador</h1>
                <p>Contenido exclusivo para el administrador.</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </AuthGuard>
    );
}