const express = require('express');
const router = express.Router();
var {pool, connection} = require('../db');

router.get('/', (req, res) => {
    try {
        connection.query(`
            select * from tbl_medicamento tm
            RIGHT join tbl_lote_medicamento tlm on tlm.tbl_medicamento_idmedicamento = tm.idmedicamento
            order by tlm.fechavencimiento;
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
        WHERE ti.idinventario = ?;
        `, [id]);
        console.log(rows[0]);
        return res.json(rows)
    } catch (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }

});


router.get('/busqueda',(req, res)=>{

    const id = req.query.id;

    try {
        pool.query(`
            select * from tbl_medicamento tm
            RIGHT join tbl_lote_medicamento tlm on tlm.tbl_medicamento_idmedicamento = tm.idmedicamento
            where tm.idmedicamento = ?
            order by tlm.fechavencimiento;`,
            [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error en la base de datos' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Medicamento no encontrado' });
                }
            
                return res.json(results); // Devuelve solo el primer resultado
        });
    } catch (err) {
        
    }
});

module.exports = router;
