import mysql from "mysql2/promise"

const createDatabase = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '210400'
    });

    await connection.query(
        'CREATE DATABASE IF NOT EXISTS quiz_system'
    );

    await connection.end();
    console.log('Banco de dados criado ou já existe');

}

createDatabase().catch((error) =>{
    console.error('Falha ao criar banco.',error);
    process.exit(1)
})