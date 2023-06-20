const oracledb = require('oracledb');
require('dotenv').config();

//string connection
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

//para almacenar la conexion del pool
let pool;

async function crearPool() {
    pool = await oracledb.createPool(dbConfig);
    
}

// validar que pool se ha creado y enviar mensaje por consola
async function getConnection() {
    if (!pool) {
        await crearPool();
    }
    console.log("Pool creado y conectado!");
    return await pool.getConnection();
}

const conn = getConnection(dbConfig);

module.exports = conn;




// oracledb.createPool(dbConfig, (err, connection) => {
//     if (err) {
//         console.error('Error al crear el pool de conexiones: ', err);
//         return;
//     } else {
//         console.log("Connected to oracleDB");
//     }

//     connection.close((err) => {
//         if (err) {
//             console.error(err.message);
//         }
//     });
// });


// oracledb.createPool(dbConfig, function (err, pool) {
//     if (err) {
//         var defaultPool =
//         oracledb.getPool(dbConfig.poolAlias);
//         defaultPool.getConnection(function (err, conn) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(conn);
//             }
//         });
//     } else {
//         pool.getConnection(function (err, conn) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(conn);
//             }
//         });
//     }
// });


// module.exports = oracledb.createPool(dbConfig);
