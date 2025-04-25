const mongoose = require("mongoose");

const varatutajatSchema = new mongoose.Schema({
    asiakas_nimi: {type:String, require: true},
    palvelu_id: {type: [Number], require: true},
    mekaanikko_id: {type:ObjectId, require: true},
    varattu_paiva: {type:ObjectId, require: true},
    varattu_aika: {type:Number, require: true},
    varaus_paiva: {type: Date, default: Date.now }
});