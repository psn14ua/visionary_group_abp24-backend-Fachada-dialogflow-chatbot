
/**
 * Ruta base: /api/login
 */

const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post('/', [
    check('correo', 'El campo email es obligatorio').not().isEmpty() && check('correo', 'El campo email no es válido').isEmail(),
    check('pwd', 'El campo Password es obligatorio').not().isEmpty(),
    validarCampos
], login);


module.exports = router;