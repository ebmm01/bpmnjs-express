require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');

// Iniciando o app
const app = express();
app.use(express.json());
app.use(cors());

// Iniciando o DB
mongoose.connect(process.env.DB_DATA, { 
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useFindAndModify: false
})

requireDir('./src/models');

app.use('/api', require('./src/routes'));

app.listen(3005);