const express = require('express');
const router = express.Router();
const {pool} = require('../db');



router.get('/', async (req, res) => {
    try{
        const [rows, fields] = await pool.query(`SELECT * FROM tbl_guia;`);
        return res.status(201).json( rows );
    }catch(err){
        console.error('Error al ejecutar el procedimiento almacenado:', err);
        pool.end();
        return res.status(500).json({ status: false, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const [rows, fields] = await pool.query(`
            INSERT INTO tbl_guia (
                nroguia,
                fechaguia,
                activoguia,
                tbl_proveedor_idproveedor,
                tbl_tipoguia_idtipoguia
            ) VALUES (
            ?,NOW(),1,?,?
            )
            `,[data.nroGuia, data.proveedorGuia, data.tipoGuia]);
            console.log(rows);
        return res.json({ status: true, resultId: rows.insertId });        
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ status: false, error: err.message });
    }
});


module.exports = router;