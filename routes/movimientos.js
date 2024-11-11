const express = require('express');
const router = express.Router();
const {connection} = require('../db');

function formatDateToYYYYMMDD(isoDate) {
    const date = new Date(isoDate);
    
    // Obtener los componentes de la fecha
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses son 0 indexados
    const day = String(date.getUTCDate()).padStart(2, '0');

    // Formatear la fecha como YYYY-MM-DD
    return `${year}-${month}-${day}`;
}


router.get('/', (req, res) => {
    connection.query('SELECT * FROM tbl_movimiento', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

router.get('/unitario', (req, res) => {
    const id = req.query.id;

    // Validación básica
    if (!id) {
        return res.status(400).json({ error: 'Se requiere un ID' });
    }

    connection.query(`
        SELECT * FROM tbl_movimiento 
        inner join tbl_medicamento tme ON tbl_medicamento_idmedicamento = idmedicamento
        WHERE idmovimiento = ?;
        `, 
        [id],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Medicamento no encontrado' });
            }

            res.json(results[0]); // Devuelve solo el primer resultado
        }
    );
});

router.post('/', (req, res) => {
    try {
        const fechaActual = new Date();

        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes +1 ya que comienza en 0
        const año = fechaActual.getFullYear();
        
        const fechaFormateada = `${año}-${mes}-${dia}`;
        console.log(fechaFormateada); // Muestra la fecha en formato dd-mm-yyyy
        
        const { medicamento, lote, cantidad, fechaVencimiento, precio, tipo } = req.body;
        connection.query(`
            insert into tbl_movimiento (
            cantidadmovimiento,
            fechavencimientomovimiento,
            preciomovimiento,
            preciounitariomovimiento,
            fechamovimineto,
            tipomovimiento,
            activomovimiento,
            tbl_medicamento_idmedicamento)
            values(
            ${cantidad},
            '${fechaVencimiento}',
            ${precio*cantidad},
            ${precio},
            '${fechaFormateada}',
            ${tipo},
            1,
            ${medicamento})`, (err, results) => {
            if (err){
                console.error(err)
                return res.status(500).send(err);
            }
        });

        if (parseInt(tipo) === 1) {
            connection.query(`
                insert into tbl_lote_medicamento (
                tbl_medicamento_idmedicamento,
                numerolote,
                fechavencimiento,
                preciolote,
                cantidadinicial,
                cantidadactual,
                activo)
                values(
                ${medicamento},
                ${lote},
                '${fechaVencimiento}',
                ${precio},
                ${cantidad},
                ${cantidad},
                1)`, (err, results) => {
                if (err){
                    console.error(err)
                    return res.status(500).send(err);
                }
            });


            connection.query(
                `UPDATE tbl_medicamento
                SET stockmedicamento = stockmedicamento + ?
                WHERE idmedicamento = ?`,
                [cantidad, medicamento],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.status(201).json({});
                }
            );


        }else if (parseInt(tipo) === 2) { // Si deseas restar en otro caso
            connection.query(
                `UPDATE tbl_medicamento
                SET stockmedicamento = stockmedicamento - ?
                WHERE idmedicamento = ?`,
                [cantidad, medicamento],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.status(201).json({});
                }
            );
        }        
    } catch (error) {
        console.error(error);
    }
});


router.post('/cajaInventario', (req, res) => {

    const fechaActual = new Date();

        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes +1 ya que comienza en 0
        const año = fechaActual.getFullYear();
        
        const fechaFormateada = `${año}-${mes}-${dia}`;

    const data = req.body

    // Función para construir la consulta
    function buildInsertQuery(data) {
        let query = `INSERT INTO tbl_movimiento (
        cantidadmovimiento,
        lote,
        tbl_movimiento_origen_id,
        fechavencimientomovimiento,
        preciomovimiento,
        preciounitariomovimiento,
        fechamovimineto,
        tipomovimiento,
        activomovimiento,
        tbl_medicamento_idmedicamento
        ) VALUES `;

        const values = data.map(movimiento => `(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )`).join(',');

        query += values + ';';

        // Crear el array de valores para los placeholders
        const flattenedValues = data.flatMap(movimiento => [
            movimiento.cantidad,
            movimiento.numerolote,
            movimiento.idlote,
            formatDateToYYYYMMDD(movimiento.fechavencimiento),
            movimiento.preciolote*movimiento.cantidad,
            movimiento.preciolote,
            fechaFormateada,
            '3',  // tipomovimiento
            '1',  // activomovimiento
            movimiento.tbl_medicamento_idmedicamento
        ]);

        return {
            query,
            values: flattenedValues
        };
    }

    connection.query(
        buildInsertQuery(data).query,
        buildInsertQuery(data).values,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        }
    );

    return res.status(201).json({ status: true });

});

module.exports = router;
