//Lisätään express, mongoose
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.URI; //hakee env tiedostosta MongoDB:n URIn. Ei näy GitHubissa!

//Lisätään mallit

const Mekaanikko = require('./models/mekaanikotSchema');
const Palvelu = require('./models/palvelutSchema');
const Varaus = require('./models/varatutajatSchema');

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

app.engine('handlebars',ExpressHandlebars.engine({
    defaultLayout: 'main'
}));

app.set('view engine','handlebars');

app.use("/mekaanikot", require("./routes/mekaanikotRoute"));
app.use("/palvelut", require("./routes/palvelutRoute"));
app.use("/varatutajat", require("./routes/varatutajatRoute"));

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})