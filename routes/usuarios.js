// usuarios.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
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
