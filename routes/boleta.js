const express = require('express');
const router = express.Router();
const pool = require('../db');



router.post('/crear', async (req, res) => {


    const data = req.body
    console.log(data)
    const medicamentos = [
        { idMedicamento: 1, cantidad: 2, tipoMovimiento: 2, idInventario: 1},
        { idMedicamento: 1, cantidad: 1, tipoMovimiento: 2, idInventario: 1},
    ];

    const medicamentosJson = JSON.stringify(medicamentos);

    try{

        const results = await pool.query('CALL sp_creacion_recibo(?)', [medicamentosJson]);
        console.log('Resultados del procedimiento almacenado:', results[0]);
        return res.status(201).json({ status: true });

    }catch(err){
        console.error('Error al ejecutar el procedimiento almacenado:', err);
        pool.end();
        return res.status(500).json({ status: false, error: err.message });
    }
});


module.exports = router;