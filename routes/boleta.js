const express = require('express');
const router = express.Router();
const {pool} = require('../db');

router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        const [rows] = await pool.query(`SELECT * FROM tbl_movimiento tmov
        INNER JOIN tbl_medicamento tmed ON tmed.idmedicamento = tmov.tbl_medicamento_idmedicamento
        INNER JOIN tbl_unidadmedida tum ON tum.idunidadmedida = tmed.tbl_unidadmedida_idunidadmedida
        WHERE tbl_recibo_idrecibo = ?;`,[id] );
        console.log(rows);
        return res.json({ rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error: " + err.message});
    }
});

router.post('/crear', async (req, res) => {
    const data = req.body;
    const jsonString = JSON.stringify(data);
    console.log(jsonString);
    try {
        const [rows] = await pool.query(
            `CALL sp_creacion_recibo(?)`, 
            [jsonString]
        );
            console.log(rows[0]);
            return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error: " + err.message});
    }
});


module.exports = router;