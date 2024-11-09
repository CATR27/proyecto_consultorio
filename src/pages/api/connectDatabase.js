import mysql from 'mysql2/promise';

const connectToDatabase = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',      // Cambia a la IP de tu servidor de MySQL
        user: 'root',
        password: 'Ontheroad27>',
        database: 'consultorio'
    });
    return connection;
};

export default connectToDatabase;
