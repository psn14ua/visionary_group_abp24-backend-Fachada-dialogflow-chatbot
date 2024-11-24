/**
 * Ruta base: /api/usuarios
 */

const { Router } = require('express');
const { getUsuario, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');


const router = Router();

router.get('/', validarJWT, getUsuario);

router.post('/', [
    validarJWT,
    check('correo', 'El campo email es obligatorio').not().isEmpty() && check('correo', 'El campo email no es válido').isEmail(),
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El campo apellidos es obligatorio').not().isEmpty().trim(),
    check('pwd', 'El campo Passwordd es obligatorio').not().isEmpty(),
    check('rol', 'El campo ROL es obligatorio').not().isEmpty(),
    check('foto', 'El campo foto es opcional').optional(),
    check('activo', 'El campo activo es opcional').optional().isNumeric().isBoolean(),
    check('centro_Id', 'El campo centro ID es obligatorio').not().optional(),
    check('cuenta_bancaria', 'El campo cuenta bancaria es obligatorio').optional(),
    check('idSubscripcion', 'El campo ID Subscripcion es opcional y debe ser número').optional().isNumeric(),
    validarCampos,
    validarRol
], crearUsuarios);

router.put('/:id', [
    validarJWT,
    check('id', 'El campo id no es válido').not().isEmpty().isNumeric(),
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El campo apellidos es obligatorio').not().isEmpty(),
    check('pwd', 'El campo Password es obligatorio').not().isEmpty(),
    check('correo', 'El campo email no es válido').isEmail(),
    check('rol', 'El campo Rol es opcional').optional(),
    check('foto', 'El campo foto es opcional').optional(),
    check('activo', 'El campo activo es obligatorio').optional().isNumeric().isBoolean(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es valido').isNumeric(),
    validarCampos,
    validarRol
], borrarUsuario);

module.exports = router;