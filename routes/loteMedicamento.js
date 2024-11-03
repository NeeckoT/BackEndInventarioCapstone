const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/', (req, res) => {
    connection.query(`
        select * from tbl_medicamento tm
        RIGHT join tbl_lote_medicamento tlm on tlm.tbl_medicamento_idmedicamento = tm.idmedicamento
        order by tlm.fechavencimiento;
        `, (err, results) => {
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
        SELECT * FROM tbl_lote_medicamento tlm
        inner join tbl_medicamento tme ON tme.idmedicamento = tlm.tbl_medicamento_idmedicamento
        WHERE tlm.idlote = ?;
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


router.get('/busqueda',(req, res)=>{

    const id = req.query.id;

    connection.query(`
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
    
        res.json(results); // Devuelve solo el primer resultado
    });

});

module.exports = router;
