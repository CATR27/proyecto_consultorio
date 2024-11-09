// src/pages/login.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log("Iniciando sesión con usuario:", usuario);

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login exitoso, redirigiendo al dashboard...");
            console.log("Cookie después de login:", document.cookie); // Verificar si el token está aquí
            router.push('/dashboard');

            if (data.rol === 'administrador') {
                router.push('/dashboard-admin');
            } else if (data.rol === 'paciente') {
                router.push('/dashboard-paciente');
            }
        }
         else {
            console.error("Error en el login:", data.message);
            setError(data.message);
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
