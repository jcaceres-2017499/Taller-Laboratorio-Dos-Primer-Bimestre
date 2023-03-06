'use strict'
//Logica
const Sucursal = require('../models/sucursal.model');

exports.test = (req,res)=>{
    res.send({message: 'Test function is running'});
}

exports.defaultSucursal = async()=>{
    try{
        let data = {
            name: 'Default',
            description: 'Default'
        }
        let existSucursalDefault = await Sucursal.findOne({name: 'Default'});
        if(existSucursalDefault) return console.log('Default sucursal already created');
        let defSucursal = new Sucursal(data);
        await defSucursal.save();
        return console.log('Default sucursal created');
    }catch(err){
        return console.error(err);
    }
}

//agregar sucursal
exports.addSucursal = async(req,res)=>{
    try{
        let data = req.body;
        //Validar duplicados
        let existsSucursal = await Sucursal.findOne({name: data.name});
        if(existsSucursal){
            return res.send({message: 'Sucursal already created'});
        }
        let sucursal = new Sucursal(data);
        await sucursal.save();
        return res.status(201).send({message: 'Created sucursal'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'ERROR saving sucursal'});
    }
}

//ver las sucursales
exports.getSucursales = async(req, res)=>{
    try{
        let sucursales = await Sucursal.find();
        return res.send({message: 'Sucursales found', sucursales})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting sucursales'});
    }
}

//editar sucursales
exports.updateSucursal = async(req, res)=>{
    try{
        //obtener el id de la sucursal
        let sucursalId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //Actualizar
        let updatedSucursal = await Sucursal.findOneAndUpdate(
            {_id: sucursalId},
            data,
            {new: true}
        )
        if(!updatedSucursal) return res.send({message: 'Sucursal not found and not updated'});
        return res.send({message:'Sucursal updated', updatedSucursal});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating sucursal'});
    }
}

//elminar sucursales
exports.deleteSucursal =async(req,res)=>{
    try{
        //id de la sucursal
        let sucursalId = req.params.id;
        //validacion si hay empresa con una sucursal que quiero eliminar
        let defaultSucursal = await Sucursal.findOne({name: 'Default'});
        if(defaultSucursal._id == sucursalId) return res.send({message: 'Default sucursal cannot deleted'});
        await Sucursal.updateMany({sucursal: sucursalId}, {sucursal: defaultSucursal._id});
        //eliminar
        let deletedSucursal = await Sucursal.findOneAndDelete({_id: sucursalId});
        if(!deletedSucursal) return res.status(404).send({message: 'Sucursal not found and not deleted'});
        return res.send({message: 'Sucursal deleted sucessfuly'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting sucursal'});
    }
}