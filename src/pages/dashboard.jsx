import AuthGuard from '../components/AuthGuard';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const handleLogout = () => {
        Cookies.remove('token'); // Eliminar token
        window.location.href = '/login'; // Redirigir al login
    };

    return (
        <AuthGuard>
            <div>
                <h1>Bienvenido al Dashboard</h1>
                <p>Contenido del Dashboard solo visible para usuarios autenticados.</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </AuthGuard>
    );
}
