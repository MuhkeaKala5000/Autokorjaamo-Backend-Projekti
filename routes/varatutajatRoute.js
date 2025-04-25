const express = require('express');
const router=express.Router()

const Varaus = require('../models/varatutajatSchema');

router.get('/', (req, res) => {
    res.send('Varaukset toimii!');
});

module.exports = router;