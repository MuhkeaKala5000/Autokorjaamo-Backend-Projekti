const express = require('express');
const router = express.Router();

const Mekaanikko = require('../models/mekaanikotSchema');
const Palvelu = require('../models/palvelutSchema');
const Varaus = require('../models/varatutajatSchema');
const {v4: uuidv4} = require('uuid');

router.post('/', async (req, res) => {
    try {
      const {asiakas_nimi, asiakas_email, palvelu_id, mekaanikko_id, varattu_aika} = req.body;
  
      const varaus_aika = new Date(varattu_aika);
      if (isNaN(varaus_aika)) return res.status(400).send('Virheellinen aika.');
  
      const palvelu = await Palvelu.findById(palvelu_id);
      const mekaanikko = await Mekaanikko.findById(mekaanikko_id);
  
      if (!palvelu) return res.status(400).send('Palvelua ei löytynyt.');
      if (!mekaanikko) return res.status(400).send('Mekaanikkoa ei löytynyt.');
  
      const palvelun_kesto = palvelu.kesto;
      const loppu_aika = new Date(varaus_aika.getTime() + palvelun_kesto * 60000);
  
      const paallekkain = await Varaus.findOne({
        mekaanikko_id: mekaanikko_id,
        varattu_aika: {$lt: loppu_aika},
        $expr: {
          $gt: [
            {$add: ['$varattu_aika', { $multiply: ['$palvelun_kesto', 60000] }]},
            varaus_aika
          ]
        }
      });
  
      if (paallekkain) return res.status(400).send('Aika on jo varattu.');
  
      const uusi_varaus = new Varaus({
        asiakas_nimi,
        asiakas_email,
        palvelu_id,
        mekaanikko_id,
        varattu_aika: varaus_aika,
        palvelun_kesto,
        varaus_id: uuidv4()
      });
  
      await uusi_varaus.save();
  
      res.status(201).json({ message: 'Varaus tallennettu!', varaus_id: uusi_varaus.varaus_id });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Jotain meni pieleen.');
    }
  });

module.exports = router;