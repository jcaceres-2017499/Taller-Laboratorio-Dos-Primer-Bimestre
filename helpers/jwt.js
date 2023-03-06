'use strict'

//Archivo para creación de tokens
const jwt = require('jsonwebtoken');

exports.createToken = async(empresa)=>{
    try{
        let payload = {
            sub: empresa._id,
            name: empresa.name,
            password: empresa.password,
            sucursal : empresa.sucursal,
            iat: Math.floor(Date.now() / 1000), //Fecha actual en formato UNIX en segundos
            exp: Math.floor(Date.now() / 1000) + (60*120)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    }catch(err){
        console.error(err);
        return err;
    }
}