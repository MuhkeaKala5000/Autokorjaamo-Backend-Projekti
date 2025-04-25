const mongoose = require('mongoose');

const mekaanikotSchema = new mongoose.Schema({
    nimi: {type:String, required: true},
    tyo_paivat: {type: [Number], required: true},
    alku_tunti: {type:Number, required: true},
    loppu_tunti: {type:Number, required: true}
});

module.exports = mongoose.model('Mekaanikko', mekaanikotSchema, 'mekaanikot');