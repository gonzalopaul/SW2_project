const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Equipo = require('../models/equipo');
const Partido = require('../models/partido');

async function loadInitialData() {
  await mongoose.connect('mongodb://localhost:27017/futbol')
    .then(() => console.log('Conexión a MongoDB exitosa'))
    .catch((error) => console.error('Error conectándose a MongoDB', error));

  // Cargar datos de equipos desde equipos.json
  const equiposData = JSON.parse(fs.readFileSync('./data/equipos.json', 'utf8'));

  try {
    await Equipo.deleteMany({});
    await Equipo.insertMany(equiposData);
    console.log('Datos de equipos cargados');
  } catch (error) {
    console.error('Error cargando datos de equipos:', error);
    mongoose.connection.close();
    return;
  }

  // Cargar datos de partidos desde partidos.csv
  const partidos = [];
  let idCounter = 1; // Inicializar el contador de ID
  fs.createReadStream('./data/partidos.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Verificar si las columnas necesarias están presentes
      if (!row.Season || !row.Date || !row.HomeTeam || !row.AwayTeam || !row.FTHG || !row.FTAG || !row.FTR || !row.HTHG || !row.HTAG || !row.HTR) {
        console.warn(`Fila inválida: ${JSON.stringify(row)}`);
        return;
      }

      // Convertir y validar datos
      const partido = {
        id: idCounter++, // Asignar un ID único incremental
        season: row.Season.trim(),
        equipoLocal: row.HomeTeam.trim(),
        equipoVisitante: row.AwayTeam.trim(),
        fecha: new Date(row.Date.trim().split('/').reverse().join('-')), // Convertir fecha a formato ISO
        fullTimeHomeGoals: parseInt(row.FTHG, 10),
        fullTimeAwayGoals: parseInt(row.FTAG, 10),
        fullTimeResult: row.FTR.trim(),
        halfTimeHomeGoals: row.HTHG ? parseInt(row.HTHG, 10) : 0, // Manejar campo vacío
        halfTimeAwayGoals: row.HTAG ? parseInt(row.HTAG, 10) : 0, // Manejar campo vacío
        halfTimeResult: row.HTR.trim() || 'N/A' // Asignar valor por defecto si está vacío
      };

      // Validar datos antes de agregar
      if (
        partido.season &&
        partido.equipoLocal &&
        partido.equipoVisitante &&
        !isNaN(partido.fullTimeHomeGoals) &&
        !isNaN(partido.fullTimeAwayGoals) &&
        partido.fullTimeResult &&
        !isNaN(partido.halfTimeHomeGoals) &&
        !isNaN(partido.halfTimeAwayGoals) &&
        partido.halfTimeResult &&
        !isNaN(partido.fecha.getTime())
      ) {
        partidos.push(partido);
      } else {
        console.warn(`Datos inválidos en la fila: ${JSON.stringify(row)}`);
      }
    })
    .on('end', async () => {
      try {
        await Partido.deleteMany({});
        await Partido.insertMany(partidos);
        console.log('Datos de partidos cargados');
      } catch (error) {
        console.error('Error cargando datos de partidos:', error);
      } finally {
        mongoose.connection.close();
      }
    });
}

loadInitialData();
