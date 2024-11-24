const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    const erroresValidacion = validationResult(req);
    if(!erroresValidacion.isEmpty()){
        return res.status(400).json({
            ok: false,
            errores: erroresValidacion.mapped()
        });
    }
    next();
}
module.exports = {
    validarCampos
}