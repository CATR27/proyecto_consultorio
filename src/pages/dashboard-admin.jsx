import AuthGuard from '../components/AuthGuard';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('rol');
    Cookies.remove('userId');
    window.location.href = '/login';
};

export default function DashboardAdmin() {
    const [userInfo, setUserInfo] = useState(null);
    const userId = Cookies.get('userId');

    useEffect(() => {
        if (!userId) {
            console.error('No se encontró el userId en las cookies');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`/api/usuarios/getUserInfo?userId=${userId}`);
                if (!response.ok) {
                    throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    return (
        <AuthGuard>
            <div>
                <h1>Dashboard de Administrador</h1>
                <p>Contenido exclusivo para el administrador.</p>

                {userInfo ? (
                    <div className="user-info">
                        {userInfo.fotografia ? (
                            <img src={`data:image/jpeg;base64,${userInfo.fotografia}`} alt="Foto del usuario" className="user-photo" />
                        ) : (
                            <p><em>Sin fotografía disponible</em></p>
                        )}
                        <p><strong>Rol:</strong> {userInfo.rol}</p>
                        <p><strong>Nombre:</strong> {userInfo.nombre} {userInfo.apellidos}</p>
                        <p><strong>Email:</strong> {userInfo.correo}</p>
                    </div>
                ) : (
                    <p>Cargando información del usuario...</p>
                )}

                <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </AuthGuard>
    );
}
