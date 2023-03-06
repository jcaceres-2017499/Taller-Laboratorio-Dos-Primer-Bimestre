'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const sucursalRoutes = require('../routers/sucursal.routes');
const empresaRoutes = require('../routers/empresa.routes');

//Configurar el servidor HTTP De Express
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/empresa', empresaRoutes);
app.use('/sucursal', sucursalRoutes);

//Funcion desde que se levanta el servidor
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server is running in port ${port}`)
}