require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const usuarios = require('./routes/usuarios');
const medicamentos = require('./routes/medicamentos');
const movimientos = require('./routes/movimientos');
const loteMedicamento = require('./routes/loteMedicamento');

// const options = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// };

app.use(express.json()); // Para parsear JSON

app.use((req, res, next) => {
    if (req.method === 'GET') {
        console.log(`Se recibió una petición GET a la ruta: ${req.url}`);
    }
    if (req.method === 'POST') {
        console.log(`Se recibió una petición POST a la ruta: ${req.url}`);
    }
    next();
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.use('/api/usuarios', usuarios);
app.use('/api/medicamentos', medicamentos);
app.use('/api/movimientos', movimientos);
app.use('/api/loteMedicamento', loteMedicamento);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
