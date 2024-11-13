const express = require('express');
const router = express.Router();
const {pool} = require('../db');



router.get('/', async (req, res) => {
    try{
        const [rows, fields] = await pool.query(`SELECT * FROM tbl_unidadmedida;`);
        return res.status(201).json( rows );
    }catch(err){
        console.error('Error al ejecutar el procedimiento almacenado:', err);
        pool.end();
        return res.status(500).json({ status: false, error: err.message });
    }
});

module.exports = router;
