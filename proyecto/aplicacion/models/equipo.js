const mongoose = require('mongoose');
const shortid = require('shortid');

const equipoSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  estadio: {
    type: String,
    required: true
  }
});

const Equipo = mongoose.model('Equipo', equipoSchema);

module.exports = Equipo;