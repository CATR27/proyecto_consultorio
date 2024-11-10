// pages/api/usuarios/getUserInfo.js
import connectToDatabase from '../connectDatabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            const connection = await connectToDatabase();
            const [rows] = await connection.execute(
                'SELECT nombre, apellidos, rol, correo, fotografia FROM usuarios WHERE id_usuario = ?',
                [userId]
            );
            await connection.end();

            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error("Error en la conexión con la base de datos:", error);
            res.status(500).json({ message: 'Error al obtener la información del usuario' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
