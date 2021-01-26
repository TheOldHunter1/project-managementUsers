// required
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const pathPublic = path.resolve(__dirname, '../public');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(pathPublic));
app.use(require('./routes/index'));

// conexion a moongoDB
mongoose.connect(process.env.urlDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {

    if (err) throw err;

    console.log('Base de datos Online');

});

app.listen(process.env.PORT, () => {
    console.log(`escuchando el ${process.env.PORT}`);
})