import AuthGuard from '../components/AuthGuard'
import Cookies from 'js-cookie'; // Asegúrate de importar Cookies

const handleLogout = () => {
    Cookies.remove('token'); // Eliminar el token
    Cookies.remove('rol'); // Eliminar el rol (si está almacenado en una cookie)
    window.location.href = '/login'; // Redirigir al login
};

export default function DashboardPaciente() {
    return (
        <AuthGuard>
            <div>
                <h1>Dashboard de Paciente</h1>
                <p>Contenido exclusivo para el paciente.</p>
                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </AuthGuard>
    );
}

