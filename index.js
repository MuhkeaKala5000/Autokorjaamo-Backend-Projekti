//Lisätään express, mongoose
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.URI; //hakee env tiedostosta MongoDB:n URIn. Ei näy GitHubissa!

//const routes = require('./routes/routes');

//Yhdistetään databaseen
mongoose.connect(mongoString);
const database = mongoose.connection;

//Error handling osio
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})