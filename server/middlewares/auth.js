const jwt = require('jsonwebtoken');

// ==================
//  verificar token
// ==================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status('401').json({
                ok: false,
                err
            })
        }

        req.usuario = decode.usuario;
        next();
    });


};

// ==================
//  verificar admin Role
// ==================

let verificaAdminRole = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status('401').json({
                ok: false,
                err
            })
        }

        if (decode.usuario.role === 'ADMIN_ROLE') {
            req.usuario = decode.usuario;
            next();
        } else {
            return res.status('401').json({
                ok: false,
                err: {
                    message: 'Usuario no tiene el rol necesario'
                }
            })
        }

    });
};

// ===============
// verifica token para imagen
// =============== 

let verificaTokenIMG = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status('401').json({
                ok: false,
                err
            })
        }

        req.usuario = decode.usuario;
        next();

    });


};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenIMG
}