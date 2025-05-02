require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.URI;
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const {v4: uuidv4} = require('uuid');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

// ——————————————————————————————
//            Mallit
// ——————————————————————————————
const Mekaanikko = require('./models/mekaanikotSchema');
const Palvelu = require('./models/palvelutSchema');
const Varaus = require('./models/varatutajatSchema');

// ——————————————————————————————
//    Yhdistetään databaseen
// ——————————————————————————————
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})


// ——————————————————————————————
//           App config
// ——————————————————————————————
const app = express();

app.use('/mekaanikot', require('./routes/mekaanikotRoute'));
app.use('/palvelut', require('./routes/palvelutRoute'));
app.use('/varatutajat', require('./routes/varatutajatRoute'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: 'salasana123',
  resave: false,
  saveUninitialized: false
}));

// ——————————————————————————————
//       Handlebars config
// ——————————————————————————————

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    formatDateForInput: function (input) {
      const d = input === 'now' || !input ? new Date() : new Date(input);
      if (isNaN(d)) return '';
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      const hours = ('0' + d.getHours()).slice(-2);
      const minutes = ('0' + d.getMinutes()).slice(-2);
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    ifEquals: function (arg1, arg2, options) {
      return (arg1.toString() === arg2.toString()) ? options.fn(this) : options.inverse(this);
    }
  }
}); 

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// ——————————————————————————————
//             GET
// ——————————————————————————————


app.get('/', async (req, res) => {
  try {
    const services = await Palvelu.find();
    res.render('home', { services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Palvelujen hakeminen epäonnistui');
  }
});

app.get('/appointmentBooker', async (req, res) => {
  try {
    const mechanics = await Mekaanikko.find();
    const services = await Palvelu.find();
    res.render('appointmentBooker', { mechanics, services });
    } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error fetching mechanics or services');
    }
});

app.get('/varatutajat', async (req, res) => {
  try {
    const bookings = await Varaus.find().populate('palvelu_id').populate('mekaanikko_id');
    res.json(bookings);
    } 
  catch (err) {
    res.status(500).send('Error fetching bookings');
    }
});

app.get('/adminBookings', async (req, res) => {
  try {
    const bookings = await Varaus.find()
    .populate('palvelu_id')
    .populate('mekaanikko_id')
    .sort({ varattu_aika: -1 });
    res.render('adminBookings', { bookings });
    } 
  catch (err) {
    console.error(err);
    res.status(500).send('Tietojen hakeminen epäonnistui.');
    }
});


app.get('/adminlogin', (req, res) => {
res.render('adminlogin');
});

app.get('/admin/bookings', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send("Pääsy evätty. Kirjaudu sisään adminina.");
    }
  const bookings = await Varaus.find()
  .populate('palvelu_id')
  .populate('mekaanikko_id');
  res.render('adminBookings', { bookings });
});

app.get('/admin/bookings/:id/edit', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send("Ei oikeuksia.");
    }
  try {
    const booking = await Varaus.findById(req.params.id)
    .populate('palvelu_id')
    .populate('mekaanikko_id');

    const mechanics = await Mekaanikko.find();

    res.render('editBooking', { booking, mechanics });
    } 
  catch (err) {
    console.error(err);
    res.status(500).send('Muokkausnäkymää ei voitu ladata.');
    }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});


// ——————————————————————————————
//             POST
// ——————————————————————————————

  app.post('/appointmentBooker', async (req, res) => {
    try {
      const { name, email, service_id, mechanic_id, datetime } = req.body;
  
      if (!name || !email || !service_id || !mechanic_id || !datetime) {
        return res.status(400).send('Kaikki kentät ovat pakollisia.');
      }
  
      const selectedService = await Palvelu.findById(service_id);
      if (!selectedService) {
        return res.status(404).send('Palvelua ei löytynyt.');
      }
  
      const varausAika = new Date(datetime);
      if (isNaN(varausAika.getTime())) {
        return res.status(400).send('Päivämäärä tai aika on virheellinen.');
      }
  
      const duration = selectedService.kesto_min;
      if (typeof duration !== 'number') {
        return res.status(500).send('Palvelun kesto on virheellinen.');
      }
  
      const newVaraus = new Varaus({
        asiakas_nimi: name,
        asiakas_email: email,
        palvelu_id: service_id,
        mekaanikko_id: mechanic_id,
        varattu_aika: varausAika,
        palvelun_kesto: duration,
        varaus_id: uuidv4()
      });
  
      await newVaraus.save();
  
      return res.render('success',{
        name,
        email,
        ticketCode: newVaraus.varaus_id
      });
  
    } 
    catch (err) {
      console.error('Booking error:', err);
      return res.status(500).send('Varaaminen epäonnistui. Yritä uudelleen.');
    }
});

app.post('/adminlogin', (req, res) => {
  const {username, password} = req.body;
  if (username === 'Masa-admin' && password === 'salasana123') {
    req.session.isAdmin = true;
    return res.redirect('/admin/bookings');
  } 
  else {
    return res.send('Väärä käyttäjänimi tai salasana.');
  }
});

app.post('/admin/bookings/:id/delete', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).send("Ei oikeuksia.");
  await Varaus.findByIdAndDelete(req.params.id);
  res.redirect('/admin/bookings');
});

app.post('/admin/bookings/:id/edit', async (req, res) => {
  if (!req.session.isAdmin) return res.status(403).send("Ei oikeuksia.");

  const { datetime, mechanic_id } = req.body;
  const fullDateTime = new Date(datetime);

  await Varaus.findByIdAndUpdate(req.params.id, {
    varattu_aika: fullDateTime,
    mekaanikko_id: mechanic_id
  });
  res.redirect('/admin/bookings');
});

app.post('/login', async (req, res) => {
  const { email, ticketId } = req.body;

  try {
    const booking = await Varaus.findOne({ asiakas_email: email, varaus_id: ticketId})
    .populate('palvelu_id')
    .populate('mekaanikko_id');

    if (!booking) {
      return res.send('Varausta ei löytynyt. Tarkista sähköposti ja varauskoodi.');
    }

    res.render('yourAppointment', { booking });
  } 
  catch (err) {
    res.status(500).send('Virhe tarkistettaessa varausta.');
  }
});

// ——————————————————————————————
//          Serveri!!
// ——————————————————————————————
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})