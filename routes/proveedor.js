const express = require('express');
const router = express.Router();
const {connection} = require('../db');


router.get('/', (req, res) => {
    connection.query('SELECT * FROM tbl_proveedor', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


module.exports = router;