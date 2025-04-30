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

const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'hbs');

app.use("/mekaanikot", require("./routes/mekaanikotRoute"));
app.use("/palvelut", require("./routes/palvelutRoute"));
app.use("/varatutajat", require("./routes/varatutajatRoute"));
app.use(express.static('public'));

//Staattiset sivut
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/aboutus', (req, res) => {
    res.render('aboutus');
});


//
app.get('/services', async (req, res) => {
    try {
        const palvelut = await Palvelu.find();
        res.render('services', { services: palvelut });
    } catch (err) {
        res.status(500).send("Palvelujen hakeminen epäonnistui");
    }
});

app.post('/check', async (req, res) => {
    const { ticketId } = req.body;

    try {
        const appointment = await Varaus.findOne({ ticketId });

        if (!appointment) {
            return res.send("Varausta ei löydy :C");
        }

        // Check time
        const now = new Date();
        const appointmentDate = new Date(appointment.date); // adjust depending on your schema

        const diffInHours = (appointmentDate - now) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return res.send("You cannot edit or cancel your appointment less than 24 hours before.");
        }

        // If valid, show details and give edit/delete options
        res.render('appointmentDetails', { appointment });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})