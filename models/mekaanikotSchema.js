const mongoose = require("mongoose");

const mekaanikotSchema = new mongoose.Schema({
    nimi: {type:String, require: true},
    tyo_paivat: {type: [Number], require: true},
    alku_tunti: {type:Number, require: true},
    loppu_tunti: {type:Number, require: true}
});