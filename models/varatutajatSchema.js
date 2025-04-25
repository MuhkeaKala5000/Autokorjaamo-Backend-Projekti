const mongoose = require('mongoose');

const varatutajatSchema = new mongoose.Schema({
    asiakas_nimi: {type:String, required: true},
    mekaanikko_id: {type:mongoose.Schema.Types.ObjectId, ref:'Mekaanikko', required: true},
    varattu_id: {type:mongoose.Schema.Types.ObjectId, ref: 'Palvelu', required: true},
    varattu_aika: {type:Number, required: true},
    varaus_paiva: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Varatut ajat', varatutajatSchema);