const { response } = require('express');

const rolesPermitidos = ['Alumno', 'Profesor', 'Administrador', 'Usuario_Individual'];

const validarRol = (req, res = response, next) => {
    const rol = req.body.rol;

    if(rol && !rolesPermitidos.includes(rol)){
        return res.status(400).json({
            ok: false,
            msg: 'El rol no permitido'
        })
    }
    next();
}

module.exports = {
    validarRol
}