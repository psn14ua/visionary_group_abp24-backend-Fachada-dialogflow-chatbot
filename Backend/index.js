/**
 * Importación de modulos
 */

const express = require('express');
const cors = require('cors');
//crear aplicación de express
const app = express();
require('dotenv').config();

//middlewares
app.use(cors());
app.use(express.json());


app.use('/api/usuarios', require('./routes/usuarios.routers'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/grupos', require('./routes/grupos.routers'));

//Abrir la aplicación en el puero 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});
