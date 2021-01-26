const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // validaciones
    let tiposValidos = ['productos', 'usuarios'];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                extension,
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            })
    }

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                extension,
                message: 'Los tipos validos son: ' + tiposValidos.join(', ')
            })
    }

    // cambiar nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds() }.${extension}`;

    let route = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(route, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    message: err
                })
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo)
        }

    })

});

function imagenUsuario(id, res, nombreArchivo, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500)
                .json({
                    ok: false,
                    message: err
                });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500)
                .json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }

                });
        }

        borrarArchivo(usuarioDB.img, tipo);
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500)
                .json({
                    ok: false,
                    message: err
                });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }

                });
        }

        borrarArchivo(productoDB.img, tipo);
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

let borrarArchivo = (nombreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    let existe = fs.existsSync(pathImagen);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;