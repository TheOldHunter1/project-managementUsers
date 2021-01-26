const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();

// Obtener usuarios
app.get('/usuario/all', verificaToken, (req, res) => {

    opt = {
        google: 'false'
    }

    Usuario.find()
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            });

        })

});

// Obtener todos usuarios activos
app.get('/usuario/active', verificaToken, (req, res) => {

    opt = {
        google: 'false'
    }

    Usuario.find({ estado: true })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            });

        })

});

// Obtener usuarios no activos
app.get('/usuario/disabled', verificaToken, (req, res) => {

    opt = {
        google: 'false'
    }

    Usuario.find({ estado: false })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments({ estado: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            });

        })

});

// Obtener usuarios LogIn Tradicional
app.get('/usuario/LogIn', verificaToken, (req, res) => {

    opt = {
        google: 'false'
    }

    Usuario.find({ google: false })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments({ google: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            });

        })

});

// Obtener usuarios LogIn Google
app.get('/usuario/Google', verificaToken, (req, res) => {

    opt = {
        google: 'false'
    }

    Usuario.find({ google: true })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments({ google: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            });

        })

});


// crear usuario
app.post('/usuario', (req, res) => {

    let body = req.body;

    console.log(body);

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password, 10),
        img: 'no-image.jpg',
        role: body.role,
        estado: true,
        google: body.google,
        creationDate: new Date()
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        // usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

});

// modificar usuario
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

    delete body.password;
    delete body.google;

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

// borrar usuario(desactivar)
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    // if (err) {
    // return res.status(400).json({
    // ok: false,
    // mensaje: err
    // });
    // }

    // if (!usuarioBorrado) {
    // return res.status(400).json({
    // ok: false,
    // err: {
    // message: 'Usuario no encontrado'
    // }
    // });
    // }

    // res.json({
    // ok: true,
    // usuario: usuarioBorrado
    // });
    // });


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

module.exports = app;