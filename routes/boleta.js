const express = require('express');
const router = express.Router();
const {pool} = require('../db');



router.post('/crear', async (req, res) => {


    const [data] = req.body
    const { idmedicamento, idinventario, cantidad } = data
    const postData = { idMedicamento: idmedicamento, idInventario: idinventario, cantidad: cantidad, tipoMovimiento: 2};
    console.log(postData);
    try {
        const [rows] = await pool.query(
            `CALL sp_creacion_recibo(?)`, 
            [JSON.stringify(postData)]
        );
            console.log(rows[0]);
            return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error: " + err.message});
    }
});


module.exports = router;