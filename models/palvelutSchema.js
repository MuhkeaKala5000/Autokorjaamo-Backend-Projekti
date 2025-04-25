const mongoose = require("mongoose");

const palvelutSchema = new mongoose.Schema({
    nimi: {type:String, require: true},
    hinta_euro: {type: Number, require: true},
    kesto_min: {type:Number, require: true},
    kuvaus: {type:String, require: true}
});