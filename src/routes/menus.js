const express = require('express');
const router = express.Router();
const config = require('../DB/db');
const oracledb = require('oracledb');

//todas los productos por consola y estructura
router.get('/allConsole', async (req, res) => {
    try {
        const connection = await config;

        const result = await connection.execute(`select * from productos`);
        const rows = result.rows;

        const menudisponible = rows.map((row) => ({
            ID_PRODUCTO: row[0],
            ID_RECETA: row[1],
            NOMBRE: row[2],
            CATEGORIA: row[3],
            PRECIO: row[4],
        }));
        //console.log(rows);
        //await connection.close();
        res.json(menudisponible);
    } catch (error) {
        console.error('Error al obtener el menú desde la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener el menú' });
    }
});

//devuelve los menus disponibles
router.get('/allMenu', async (req, res) => {
    try {
        const connection = await config;
        const result = await connection.execute(
            `BEGIN
            SP_VER_MENU_DISP(:v_menus);
            END;`,
            {
                v_menus: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const resultSet = result.outBinds.v_menus;
        let row;
        const results = [];

        while ((row = await resultSet.getRow())) {
            results.push(row);
        }

        await resultSet.close();
        //await connection.close();

        res.json(results);
    } catch (err) {
        console.error('Error al llamar al procedimiento almacenado', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;