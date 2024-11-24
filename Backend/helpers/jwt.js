const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarJWT = (email) => {

    return new Promise((resolve, reject) => {
        const playload = {
            email
        }

        jwt.sign(playload, process.env.JWETSECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el JWT');
            }
            else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}