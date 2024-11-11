// usuarios.js
const express = require('express');
const router = express.Router();
const {connection} = require('../db');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query(`
        SELECT tm.*, tl.descripcionlaboratorio, tu.descripcionunidadmedida FROM tbl_medicamento tm
        join tbl_laboratorio tl on tl.idlaboratorio = tm.tbl_laboratorio_idlaboratorio
        join tbl_unidadmedida tu on tu.idunidadmedida = tm.tbl_unidadmedida_idunidadmedida
        order by stockmedicamento desc, nombrecomercialmedicamento;`, (err, results) => {
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

    connection.query(
        'SELECT * FROM tbl_medicamento WHERE idmedicamento = ?', 
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

// Crear un nuevo usuario
router.post('/', (req, res) => {
    const { nombre, email } = req.body;
    connection.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, nombre, email });
    });
});
// Exporta el router
module.exports = router;
