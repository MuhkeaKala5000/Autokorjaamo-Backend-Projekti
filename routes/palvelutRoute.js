const express = require('express');
const router = express.Router()

const Palvelu = require('../models/palvelutSchema');

router.get('/', async (req, res) => {
    const palvelut = await Palvelu.find();
    console.log('Meidän palvelumme', palvelut);
    res.json(palvelut);
});

module.exports = router;