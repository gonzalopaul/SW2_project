// models/partido.js
const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  equipoLocal: { type: String, required: true },
  equipoVisitante: { type: String, required: true },
  fecha: { type: Date, required: true },
  fullTimeHomeGoals: { type: Number, required: true },
  fullTimeAwayGoals: { type: Number, required: true },
  fullTimeResult: { type: String, required: true },
  halfTimeHomeGoals: { type: Number, required: true },
  halfTimeAwayGoals: { type: Number, required: true },
  halfTimeResult: { type: String, required: true }
});

module.exports = mongoose.model('Partido', partidoSchema);
