const express = require('express');
const router=express.Router()

const Mekaanikko = require('../models/mekaanikotSchema');

router.get('/', async (req, res) => {
    const mekaanikot = await Mekaanikko.find();
    console.log('Mekaanikot löytyi:', mekaanikot);
    res.json(mekaanikot);
});

module.exports = router;