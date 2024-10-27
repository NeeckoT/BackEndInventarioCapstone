const express = require('express');
const router = express.Router();
const connection = require('../db');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query('SELECT * FROM tbl_movimiento', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
    const fechaActual = new Date();

    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes +1 ya que comienza en 0
    const año = fechaActual.getFullYear();
    
    const fechaFormateada = `${año}-${mes}-${dia}`;
    console.log(fechaFormateada); // Muestra la fecha en formato dd-mm-yyyy
    
    const { medicamento, cantidad, fechaVencimiento, precio, tipo } = req.body;
    connection.query(`
        insert into tbl_movimiento (
        cantidadmovimiento,
        fechavencimientomovimiento,
        preciomovimiento,
        preciounitariomovimiento,
        fechamovimineto,
        tipomovimiento,
        activomovimiento,
        tbl_medicamento_idmedicamento)
        values(
        ${cantidad},
        '${fechaVencimiento}',
        ${precio*cantidad},
        ${precio},
        '${fechaFormateada}',
        ${tipo},
        1,
        ${medicamento})`, (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).send(err);
        }
    });
    console.log(tipo);
    console.log(typeof tipo);
    console.log(parseInt(tipo) === 1);
    if (parseInt(tipo) === 1) {
        connection.query(
            `UPDATE tbl_medicamento
            SET stockmedicamento = stockmedicamento + ?
            WHERE idmedicamento = ?`,
            [cantidad, medicamento],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.status(201).json({});
            }
        );
    }else if (parseInt(tipo) === 2) { // Si deseas restar en otro caso
        connection.query(
            `UPDATE tbl_medicamento
            SET stockmedicamento = stockmedicamento - ?
            WHERE idmedicamento = ?`,
            [cantidad, medicamento],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.status(201).json({});
            }
        );
    }
    
});
// Exporta el router
module.exports = router;
