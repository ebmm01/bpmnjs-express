require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cors = require('cors');
const expressWs = require('express-ws')(app);


// Iniciando o app
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

app.listen(process.env.PORT, () => {
    console.log('Server connected on port: ',process.env.PORT )
});