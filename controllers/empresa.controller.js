'use strict'
//Logica
const Empresa = require('../models/empresa.model');
const Sucursal = require('../models/sucursal.model');
const { validateData, encrypt, checkPassword } = require('../helpers/validate');
const {createToken} = require('../helpers/jwt')


exports.test = (req,res)=>{
    res.send({message: 'Test function is running'});
}

//loguearse
exports.login = async(req,res)=>{
    try{
        //obtener la data a validad(name y password)
        let data = req.body;
        let cretentials ={
            name: data.name,
            password: data.password
        }
        let msg = validateData(cretentials);
        if(msg) return res.status(400).send(msg);
        //validar que exista en la DB
        let empresa = await Empresa.findOne({name: data.name});
        //validar la constraseña
        if(empresa && await checkPassword(data.password, empresa.password)){
            let token = await createToken(empresa);
            //retornar un mensaje de logeo con un token
            return res.send({message: 'User logges succesfully', token});
        } 
        return res.status(401).send({message: 'Invalid credentials'});
        
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error, not logged'});
    }
}

//agregar empresa
exports.addEmpresa = async(req,res)=>{
    try{
        let data = req.body;
        //validacion si existe la sucursal
        let existsSucursal= await Sucursal.findOne({_id: data.sucursal});
        if(!existsSucursal) return res.status(404).send({message: 'Sucursal not found'});
        //Validar duplicados
        let existsEmpresa = await Empresa.findOne({name: data.name});
        if(existsEmpresa){
            return res.send({message: 'Empresa already created'});
        }
        //Encriptar constraseña
        data.password = await encrypt(data.password);
        let empresa = new Empresa(data);
        await empresa.save();
        return res.status(201).send({message: 'Created empresa'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'ERROR saving empresa'});
    }
}

//ver las empresas
exports.getEmpresas = async(req, res)=>{
    try{
        let empresas = await Empresa.find();
        return res.send({message: 'Empresas found', empresas})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting empresas'});
    }
}

//editar empresas
exports.updateEmpresa = async(req, res)=>{
    try{
        //obtener el id del curso
        let empresaId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //validacion si existe la sucursal
        //Validar duplicados
        let existsEmpresa = await Empresa.findOne({name: data.name});
        if(existsEmpresa){
            return res.send({message: 'Empresa already created'});
        }
        //Actualizar
        let updatedEmpresa = await Empresa.findOneAndUpdate(
            {_id: empresaId},
            data,
            {new: true}
        )
        if(!updatedEmpresa) return res.send({message: 'Empresa not found and not updated'});
        return res.send({message:'empresa updated', updatedEmpresa});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating empresa'});
    }
}

//elminar empresas
exports.deleteEmpresa =async(req,res)=>{
    try{
        //id del curso
        let empresaId = req.params.id;
        //eliminar
        let deletedEmpresa = await Empresa.findOneAndDelete({_id: empresaId});
        if(!deletedEmpresa) return res.status(404).send({message: 'Empresa not found and not deleted'});
        return res.send({message: 'Empresa deleted sucessfuly'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting empresa'});
    }
}