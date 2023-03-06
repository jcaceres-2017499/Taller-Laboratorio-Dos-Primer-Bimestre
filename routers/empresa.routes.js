'use strict'
const express = require('express');
const api = express.Router();
const empresaController = require('../controllers/empresa.controller');
const {ensureAuth} = require('../middleware/authenticated');

//Ruta de testeo
api.get('/test', empresaController.test);
api.post('/login', empresaController.login);
api.post('/add', empresaController.addEmpresa);
api.get('/get', ensureAuth, empresaController.getEmpresas);
api.put('/update/:id', ensureAuth, empresaController.updateEmpresa);
api.delete('/delete/:id',ensureAuth, empresaController.deleteEmpresa);
module.exports = api;