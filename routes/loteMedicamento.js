const express = require('express');
const router = express.Router();
var {pool, connection} = require('../db');

router.get('/', (req, res) => {
    try {
        connection.query(`
            select * from tbl_medicamento tm
            RIGHT join tbl_inventario ti on ti.tbl_medicamento_idmedicamento = tm.idmedicamento
            RIGHT join tbl_unidadmedida tum on tum.idunidadmedida = tm.tbl_unidadmedida_idunidadmedida
            order by ti.fechavencimientoinventario;
            `, (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });        
    } catch (err) {
        
    }
});

router.get('/unitario', async (req, res) => {
    const id = req.query.id;
    // Validación básica
    if (!id) {
        return res.status(400).json({ error: 'Se requiere un ID' });
    }

    try {
        const [rows, fields] = await pool.query(`
        SELECT * FROM tbl_inventario ti
        inner join tbl_medicamento tme ON tme.idmedicamento = ti.tbl_medicamento_idmedicamento
        inner join tbl_unidadmedida tum ON tum.idunidadmedida = tme.tbl_unidadmedida_idunidadmedida
        WHERE ti.idinventario = ?;
        `, [id]);
        console.log(rows[0]);
        return res.json(rows)
    } catch (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }

});


router.get('/busqueda', async (req, res)=>{

    const id = req.query.id;

    try {
        const [rows, fields] = await pool.query(`
            select * from tbl_medicamento tm
            RIGHT join tbl_inventario ti on ti.tbl_medicamento_idmedicamento = tm.idmedicamento
            where tm.idmedicamento = ? AND  ti.cantidadfinalinventario <> 0
            order by ti.fechavencimientoinventario, ti.cantidadfinalinventario desc;`,
            [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error en la base de datos' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Medicamento no encontrado' });
                }
            
        });
        return res.json(rows); // Devuelve solo el primer resultado
    } catch (err) {
        
    }
});



router.post('/', async (req, res)=>{

    const data = req.body;

    console.log(data);

    try {
        const [rows, fields] = await pool.query(`
            CALL sp_crear_inventario(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
            )
            `,
            [data.lote, data.precio, data.cantidad, data.fechaVencimiento, data.medicamento, data.nroGuia],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error en la base de datos' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Medicamento no encontrado' });
                }
            
            });
            console.log(rows[0]);
            console.log(fields);
            return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error: " + err.message});
    }
});




module.exports = router;
