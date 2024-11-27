// usuarios.js
const express = require('express');
const router = express.Router();
const {pool} = require('../db');

// Obtener todos los usuarios
router.get('/movsMedicamentos', async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.query;
        console.log(fechaInicio, fechaFinal);
        const [rows, fields] = await pool.query(`
            SELECT tbl_medicamento_idmedicamento, SUM(cantidadmovimiento) AS cantidadRetiros,
            nombrecomercialmedicamento, nombrecompuestomedicamento,
            pesopastillamedicamento, cantidadpastillasmedicamentos, descripcionunidadmedida, descripcionlaboratorio
            FROM tbl_movimiento tmov
            INNER JOIN tbl_medicamento tmed ON tmed.idmedicamento = tmov.tbl_medicamento_idmedicamento
            INNER JOIN tbl_unidadmedida tu on tu.idunidadmedida = tmed.tbl_unidadmedida_idunidadmedida
            INNER JOIN tbl_laboratorio tl on tl.idlaboratorio = tmed.tbl_laboratorio_idlaboratorio
            WHERE tbl_tipomovimiento_idtipomovimiento = 2 AND fechamovimiento between '2024-10-01' AND '2024-12-01'
            group by tbl_medicamento_idmedicamento
            ORDER BY cantidadRetiros DESC;`, [fechaInicio, fechaFinal]);
        return res.json({ rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});


router.get('/vencMedicamentos', async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.query;
        console.log(fechaInicio, fechaFinal);
        const [rows, fields] = await pool.query(`
            SELECT * 
            FROM tbl_inventario ti
<<<<<<< HEAD
            INNER JOIN tbl_medicamento tm ON tm.idmedicamento = ti.idinventario
            INNER JOIN tbl_unidadmedida tu on tu.idunidadmedida = tm.tbl_unidadmedida_idunidadmedida
            INNER JOIN tbl_laboratorio tl on tl.idlaboratorio = tm.tbl_laboratorio_idlaboratorio
=======
            LEFT JOIN tbl_medicamento tm ON tm.idmedicamento = ti.idinventario
>>>>>>> a714b75254cc78251a729b0616948f1b41ede8dd
            WHERE fechavencimientoinventario between ? AND ?
            ORDER BY fechavencimientoinventario, cantidadfinalinventario DESC;`, [fechaInicio, fechaFinal]);
        return res.json({ rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});


module.exports = router;