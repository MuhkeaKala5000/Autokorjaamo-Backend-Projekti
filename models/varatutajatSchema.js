const mongoose = require('mongoose');

const varatutajatSchema = new mongoose.Schema({
    asiakas_nimi: {type: String, required: true},
    asiakas_email: {type: String, required: true},
    palvelu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Palvelu', required: true},
    mekaanikko_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Mekaanikko', required: true},
    varattu_aika: {type: Date, required: true},
    palvelun_kesto: {type: Number, required: true},
    varaus_id: {type: String, required: true},}, 
    {timestamps: true}
);

module.exports = mongoose.model('VaratutAjat', varatutajatSchema, 'varatutajat');