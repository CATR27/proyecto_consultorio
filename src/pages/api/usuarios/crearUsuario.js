// src/pages/api/usuarios/crearUsuario.js
import connectToDatabase from '../../api/connectDatabase';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Deshabilita el bodyParser para manejar el archivo con formidable
    },
};

export default async function handler(req, res) {
    console.log("Handler para crear usuario llamado");

    if (req.method === 'POST') {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                return res.status(500).json({ message: 'Error al procesar el archivo' });
            }

            const usuario = Array.isArray(fields.usuario) ? fields.usuario[0] : fields.usuario;
            const correo = Array.isArray(fields.correo) ? fields.correo[0] : fields.correo;
            const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
            const rol = Array.isArray(fields.rol) ? fields.rol[0] : fields.rol;
            const nombre = Array.isArray(fields.nombre) ? fields.nombre[0] : fields.nombre;
            const apellidos = Array.isArray(fields.apellidos) ? fields.apellidos[0] : fields.apellidos;
            const fotoFile = files.fotografia;

            console.log("Datos recibidos:", { usuario, correo, password, rol, nombre, apellidos });

            if (!usuario || !correo || !password || !rol || !nombre || !apellidos) {
                console.error("Faltan campos obligatorios");
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            const db = await connectToDatabase();

            try {
                console.log("Verificando si el usuario o correo ya existen");
                const [existingUser] = await db.execute('SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', [usuario, correo]);
                if (existingUser.length > 0) {
                    console.error("El usuario o correo ya están en uso");
                    return res.status(409).json({ message: 'El usuario o correo ya están en uso' });
                }

                console.log("Encriptando la contraseña");
                const hashedPassword = await bcrypt.hash(password, 10);

                let fotoData = null;
                if (fotoFile && fotoFile.filepath) {
                    console.log("Leyendo archivo de foto");
                    fotoData = fs.readFileSync(fotoFile.filepath);
                }

                console.log("Insertando nuevo usuario en la base de datos");
                await db.execute(
                    `INSERT INTO usuarios (usuario, correo, password, rol, nombre, apellidos, fotografia, estatus)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [usuario, correo, hashedPassword, rol, nombre, apellidos, fotoData, 1]
                );

                console.log("Usuario registrado exitosamente");
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            } catch (error) {
                console.error("Error al registrar usuario:", error);
                res.status(500).json({ message: 'Error en el servidor' });
            }
        });
    } else {
        console.error("Método no permitido");
        res.status(405).json({ message: 'Método no permitido' });
    }
}
