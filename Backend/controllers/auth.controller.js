const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const sql = require('mysql');
const { promisify } = require('util');
const e = require('express');


const db_connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


const query = promisify(db_connection.query).bind(db_connection);


const login = async(req, res = response) => {

    var emailExistente = '';
    const { correo, pwd } = req.body;
    // console.log(pwd);

    try{
        const usuarioBD = await query('SELECT * FROM usuario WHERE correo = ?', [correo]);
         
        if(usuarioBD.length === 0){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o contraseña incorrectos',
                token: ''
            });
        }
        else{
            const usuario_Passwordd_almacenado = await query('SELECT pwd FROM usuario WHERE correo = ?', [correo]);
            emailExistente = correo;

            const validarPasswordd = bcrypt.compareSync(pwd, usuario_Passwordd_almacenado[0].pwd);

            if(!validarPasswordd){
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario o contraseña incorrectos',
                    token: ''
                });
            }
        }

        //vamos a generar nuestro token una vez que hemos combrabado todo
        const token =  await generarJWT(emailExistente);
        
        return res.json({
            ok: true,
            msg: 'El usuario ha sido logueado',
            token: token
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al loguear el usuario', 
            token: ''
        });
    }
}

module.exports = {
    login
}