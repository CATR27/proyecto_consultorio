// src/pages/api/login.js
import connectToDatabase from './connectDatabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    console.log("Handler de login llamado");

    if (req.method === 'POST') {
        const { usuario, password } = req.body;

        console.log("Datos recibidos en login:", { usuario, password });

        const db = await connectToDatabase();

        try {
            console.log("Buscando usuario en la base de datos");
            const [rows] = await db.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

            if (rows.length === 0) {
                console.error("Usuario no encontrado");
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const user = rows[0];
            console.log("Usuario encontrado:", user);

            console.log("Comparando contraseñas");
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                console.error("Contraseña incorrecta");
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            console.log("Generando token JWT");
            const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, 'clave_secreta', { expiresIn: '1h' });

            console.log("Estableciendo cookie de sesión (sin Secure para desarrollo)");
            res.setHeader('Set-Cookie', `token=${token}; Path=/; SameSite=Lax`);

            res.setHeader('Set-Cookie', [
                `token=${token}; Path=/; SameSite=Lax`,
                `rol=${user.rol}; Path=/; SameSite=Lax`,
                `userId=${user.id_usuario}; Path=/; SameSite=Lax`  // Asegúrate de establecer userId
            ]);
            
            
            res.status(200).json({ message: 'Login exitoso', rol: user.rol });
        } catch (error) {
            console.error("Error en el proceso de login:", error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    } else {
        console.error("Método no permitido en login");
        res.status(405).json({ message: 'Método no permitido' });
    }
}
