const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sql = require('mysql');
require('dotenv').config();
const { promisify } = require('util');
const e = require('express');



const db_connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//convertiendo en una funcion combatible con promesas
const query = promisify(db_connection.query).bind(db_connection);



const getUsuario = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;

    try{
        if(id){
            if(!Number(id)){
                return res.status(400).json({
                    ok: false,
                    msg: 'El ID de usuario no es un número'
                });
            }
            else{
                const [usuario, total] = await Promise.all([
                    query('SELECT * FROM usuario WHERE IdUsuario = ?', [id]),
                    query('SELECT COUNT(*) as Total FROM usuario')
                ]);

                return res.status(200).json({
                    ok: true,
                    msg: 'usuario obtenido',
                    usuario,
                    page: {
                        desde,
                        registropp,
                        total
                    }
                });
            }

        }
        else{
            //realizando paginación
            const [usuarios, total] = await Promise.all([
                query('SELECT * FROM usuario LIMIT ? OFFSET ?', [registropp, desde]),
                query('SELECT COUNT(*) as Total FROM usuario')
            ]);

            if(usuarios === null){
                return res.status(400).json({
                    ok: false,
                    msg: 'No hay usuarios'
                })
            }

            res.status(200).json({
                ok: true,
                msg: 'Usuarios obtenidos',
                usuarios,
                page: {
                    desde,
                    registropp,
                    total
                }
            });

        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener el usuario'
        })
    }
}

const crearUsuarios = async(req, res = response) => {

    const { centro_Id, cuenta_bancaria, idSubscripcion, nombre, correo, pwd, apellidos, rol, foto, activo } = req.body;
    var esActivo = Boolean;

    try{
        const existeEmail = await query(`SELECT * FROM USUARIO WHERE correo =  ? `, [correo]);
        
        if(existeEmail.length > 0){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya existe'
            });
        }
        else{
            const salt = bcrypt.genSaltSync();
            const passHash = bcrypt.hashSync(pwd, salt);


            if(activo == null){
                esActivo = 0;
            }
            else{
                esActivo = activo;
            }            

            const usuario = {
                nombre,
                apellidos,
                correo,
                pwd: passHash,
                Rol: rol,
                foto,
                activo: esActivo
            }
        
            const result = await query('INSERT INTO usuario SET ?', [usuario]);
            const insertId = result.insertId;
            console.log(insertId);
            
            if(Number(centro_Id)){
                if(rol === 'Alumno'){
                    await query('INSERT INTO alumno SET idusuario = ?, centro_id = ?', [insertId, centro_Id]);
                }
                else if(rol === 'Profesor'){
                    await query('INSERT INTO profesor SET idusuario = ?, centro_id = ?', [insertId, centro_Id]);
                }
                else if(rol === 'Administrador'){ 
                    await query('INSERT INTO administrador SET idusuario = ?', [insertId]);
                }
                else if(rol === 'Usuario_Individual'){
                    await query('INSERT INTO usuario_individual SET idusuario = ?, cuenta_bancaria = ?, idSuscripcion = ?', [insertId, cuenta_bancaria, idSubscripcion]);
                }
            }

            return res.status(200).json({
                ok: true,
                msg: 'El usuario ha sido creado correctamente'
                // pass: passHash
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'El usuario no ha sido creado por algun error', 
        })
    }
}
const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;
    const { pwd, rol, ...Object } = req.body;

    try{
        const existeUsuario = await query('SELECT * FROM usuario WHERE idusuario = ?', [uid]); 

        if(existeUsuario.length === 0){
            return res.status(400).json({
                ok: false,
                msg: 'El Usuario no existe entonces no se puede actualizar'
            });
        }

        const usuarioActualizado = await query('UPDATE usuario SET ? WHERE idusuario = ?', [Object, uid]);

        return res.json({
            ok: true,
            msg: 'El usuario ha sido actualizado correctamente', 
            usuarioActualizado
        })

    }
    catch(error){
        return res.status(500).json({
            ok:false,
            msg: 'El usuario no ha sido actualizado'
        })
    }
}
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try{

        const usuarioExiste = await query('SELECT * FROM USUARIO WHERE idusuario = ?', [uid]);

        if(usuarioExiste.length === 0){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese ID'
            })
        }

        await query('DELETE FROM usuario WHERE idusuario = ?', [uid]);

        return res.status(200).json({
            ok: true,
            msg: 'El usuario ha sido eliminado correctamente'
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'El usuario no ha sido eliminado por algún error'
        })
    }
}

module.exports = {
    getUsuario, crearUsuarios, actualizarUsuario, borrarUsuario
}