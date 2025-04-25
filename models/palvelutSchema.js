const mongoose = require('mongoose');

const palvelutSchema = new mongoose.Schema({
    nimi: {type:String, required: true},
    hinta_euro: {type: Number, required: true},
    kesto_min: {type:Number, required: true},
    kuvaus: {type:String, required: true}
});

module.exports = mongoose.model('Palvelut', palvelutSchema, 'palvelut');