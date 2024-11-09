// src/pages/registerUser.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterUser() {
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('paciente'); // Valor por defecto: 'paciente'
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fotografia, setFotografia] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Verificamos el valor de password antes de enviarlo
        console.log('Password en el frontend:', password);

        const formData = new FormData();
        formData.append('usuario', usuario);
        formData.append('correo', correo);
        formData.append('password', password); // Aseguramos que password sea enviado como cadena
        formData.append('rol', rol);
        formData.append('nombre', nombre);
        formData.append('apellidos', apellidos);
        if (fotografia) {
            formData.append('fotografia', fotografia);
        }

        const response = await fetch('/api/usuarios/crearUsuario', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            setSuccess(data.message);
            setTimeout(() => {
                router.push('/login'); // Redirige al login después del registro
            }, 2000);
        } else {
            setError(data.message);
        }
    };

    return (
        <div>
            <h1>Registro de Usuario</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                    <option value="administrador">Administrador</option>
                    <option value="paciente">Paciente</option>
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotografia(e.target.files[0])}
                />
                <button type="submit">Registrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}
