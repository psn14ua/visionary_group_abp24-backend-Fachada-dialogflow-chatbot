/**
 * Ruta base: /api/grupos
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { getGrupo, crearGrupo, actualizarGrupo, borrarGrupo } = require('../controllers/grupos.controller');

const router = Router();

router.get('/', validarJWT, getGrupo);

 router.post('/', [
    validarJWT,
    check('asignatura', 'El campo asignatura es obligatorio').not().isEmpty(),
    check('grupo', 'El campo grupo es obligatorio').not().isEmpty() && check('grupo', 'El campo grupo debe ser un número').isNumeric(),
    check('idprofesor', 'El campo profesor es opcional').not().isEmpty().isNumeric(),
    validarCampos,
 ], crearGrupo);

 router.put('/:id', [
    validarJWT,
    check('id', 'El identificador debe ser un numero').not().isEmpty().isNumeric(),
    check('asignatura', 'El campo asignatura obligatorio').not().isEmpty(),
    check('grupo', 'El grupo es obligatorio para editarlo').not().isEmpty(),
    check('idprofesor', 'El campo id profesor es obligatorio').not().isEmpty().isNumeric(),
    validarCampos,
 ], actualizarGrupo);

 router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es valido').not().isEmpty().isNumeric(),
    validarCampos,
 ], borrarGrupo);

 module.exports = router;

