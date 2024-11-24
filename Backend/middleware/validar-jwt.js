const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(400).json({
            ok: false, 
            msg: 'Falta token de autorización'
        });
    }

    try{
        const { email, ...object } = jwt.verify(token, process.env.JWETSECRET);
        
        req.email = email;
        next();
    }
    catch(err){
        console.log(err);
        return res,status(500).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}