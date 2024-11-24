const { response } = require('express');
const sql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();


const db_connection = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const query = promisify(db_connection.query).bind(db_connection);

const getGrupo = async(req, res = response) => {

    //paginacion
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE)

    try{

        const [grupos, total] = await Promise.all([
            query('SELECT * FROM grupo LIMIT ? OFFSET ?', [registropp, desde]),
            query('SELECT COUNT(*) as Total FROM grupo')
        ]);

        if(grupos === null){
            return res.status(400).json({
                ok: false,
                msg: 'No hay grupos'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Grupos obtenidos',
            grupos,
            page: {
                desde,
                registropp,
                total
            }
        });
    }
    catch(error){
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener los grupos'
        })
    }
}

const crearGrupo = async(req, res = response) => {
    const { asignatura, grupo, idprofesor } = req.body;

    try{

        await query('INSERT INTO grupo (asignatura, grupo, idprofesor) VALUES (?, ?, ?)', [asignatura, grupo, idprofesor]);

        return res.status(200).json({
            ok: true,
            msg: 'Grupo creado correctamente'
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el grupo'
        });
    }
}

const actualizarGrupo = async(req, res = response) => {
    const { asignatura, grupo, idprofesor} = req.body;
    const id = req.params.id;

    console.log(id);

    try{
        const idGrupo = await query('SELECT * FROM grupo WHERE IDGrupo = ?', [id]);

        console.log(idGrupo);

        if(idGrupo.length === 0){
            res.status(400).json({
                ok: false,
                msg: 'No existe grupo con ese ID'
            });
        }

        const l = await query('UPDATE grupo SET asignatura = ?, grupo = ?, idprofesor = ? WHERE IdGrupo = ?', [asignatura, grupo, idprofesor, id]);
        console.log(l);
        return res.status(200).json({
            ok: true,
            msg: 'Grupo actualizado correctamente',
            l
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el grupo'
        });
    }
}

const borrarGrupo = async(req, res = response) => {
    const id = req.params.id;

    try{
        const usuario = await query('SELECT * FROM grupo WHERE idgrupo = ?', [id]);

        if(usuario.length === 0){
            return res.status(400).json({
                ok: false,
                msg: 'No existe grupo con ese ID'
            });
        }

        await query('DELETE FROM grupo WHERE idgrupo = ?', [id]);

        return res.status(200).json({
            ok: true,
            msg: 'Grupo eliminado correctamente'
        });
    }
    catch(error){
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el grupo'
        });
    }
}


module.exports = { getGrupo, crearGrupo, actualizarGrupo, borrarGrupo };