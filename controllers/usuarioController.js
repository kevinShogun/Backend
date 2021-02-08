
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // revisar si hay errores
     const errores = validationResult(req);
     if(!errores.isEmpty () ){
        return res.status(400).json({errores: errores.array() })
    } 

    const {email, password} = req.body;

     try {
        let usuario = await Usuario.findOne({email});
         
        if(usuario){
            return res.status(400).json({msg: 'El Usuario ya existe'});
        }
        //crea el nuevo usuario

        usuario = new Usuario(req.body);
        // hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardar el nuevo usuario
        await usuario.save();

        // crear y firmar el JWT
        const payload = {
            id: usuario.id
        };

        //firmar 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            res.json({ token });
        });


        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    } 
}