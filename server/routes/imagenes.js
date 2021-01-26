const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaTokenIMG } = require('../middlewares/auth')


app.get('/imagen/:tipo/:img', verificaTokenIMG, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = `./uploads/${tipo}/${img}`;
    let noImg = path.resolve(__dirname, '../assets/no-image.jpg')


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImg);
    }



});

module.exports = app;