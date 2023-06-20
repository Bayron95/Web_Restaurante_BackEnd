const express = require('express');
const router = express.Router();
const config = require('../DB/db');
const oracledb = require('oracledb');

//todas las mesas por consola y estructura
router.get('/allConsole', async (req, res) => {
    try {
        const connection = await config;

        const result = await connection.execute(`select * from mesas`);
        const rows = result.rows;

        const mesasdisponibles = rows.map((row) => ({
            ID_MESA: row[0],
            CAPACIDAD: row[1],
            ESTADO_MESA: row[2],
            // Agrega más propiedades según la estructura de tu tabla MESAS
        }));
        //console.log(rows);
        //await connection.close();

        res.json(mesasdisponibles);
    } catch (error) {
        console.error('Error al obtener las mesas desde la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener las mesas' });
    }
});

//devuelve las mesas disponibles
router.get('/all', async (req, res) => {
    try {
        const connection = await config;
        const result = await connection.execute(
            `BEGIN
            SP_VER_MESAS_DISP(:v_mesas);
            END;`,
            {
                v_mesas: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const resultSet = result.outBinds.v_mesas;
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

router.put('/asignarMesa/:id_mesa', async (req, res) => {
    const { id_mesa } = req.params;
    const { estado_Mesa } = req.body;
    try {
        // Establecer la conexión a la base de datos
        const connection = await config;
        // Llamar al procedimiento almacenado
        const result = await connection.execute(
            `BEGIN
            SP_UPDATE_MESA(:v_id,:v_estado_Mesa);
            END;`,
            {
                v_id: id_mesa,
                v_estado_Mesa: "Ocupada"
            }
        );
        // Cerrar la conexión
        //await connection.close();
        res.status(200).json({ message: 'Actualización exitosa' });
    } catch (err) {
        console.error('Error al actualizar la mesa', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;