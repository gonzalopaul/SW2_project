const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Equipo = require('../models/equipo');
const Partido = require('../models/partido');
const Jugador = require('../models/jugador'); // Importar el modelo Jugador

async function loadInitialData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/futbol', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error conectándose a MongoDB', error);
    return;
  }

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
      if (!row.Season || !row.Date || !row.HomeTeam || !row.AwayTeam || !row.FTHG || !row.FTAG || !row.FTR || !row.HTHG || !row.HTAG || !row.HTR) {
        console.warn(`Fila inválida: ${JSON.stringify(row)}`);
        return;
      }

      const partido = {
        id: idCounter++,
        season: row.Season.trim(),
        equipoLocal: row.HomeTeam.trim(),
        equipoVisitante: row.AwayTeam.trim(),
        fecha: new Date(row.Date.trim().split('/').reverse().join('-')),
        fullTimeHomeGoals: parseInt(row.FTHG, 10),
        fullTimeAwayGoals: parseInt(row.FTAG, 10),
        fullTimeResult: row.FTR.trim(),
        halfTimeHomeGoals: row.HTHG ? parseInt(row.HTHG, 10) : 0,
        halfTimeAwayGoals: row.HTAG ? parseInt(row.HTAG, 10) : 0,
        halfTimeResult: row.HTR.trim() || 'N/A'
      };

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
        // Cargar datos de jugadores desde jugadores.csv
        const jugadores = [];
        fs.createReadStream('./data/jugadores.csv')
          .pipe(csv())
          .on('data', (row) => {
            const jugador = {
              team: row.Team,
              position: row.Position,
              shirtNumber: row['Shirt number'],
              name: row.Name,
              minutesPlayed: parseInt(row['Minutes played'], 10),
              gamesPlayed: parseInt(row['Games played'], 10),
              percentageGamesPlayed: parseFloat(row['Percentage of games played']),
              fullGamesPlayed: parseInt(row['Full games played'], 10),
              percentageFullGamesPlayed: parseFloat(row['Percentage of full games played']),
              gamesStarted: parseInt(row['Games started'], 10),
              percentageGamesStarted: parseFloat(row['Percentage of games started']),
              gamesSubstituted: parseInt(row['Games where substituted'], 10),
              percentageGamesSubstituted: parseFloat(row['Percentage of games where substituted']),
              yellowCards: parseInt(row['Yellow Cards'], 10),
              redCards: parseInt(row['Red Cards'], 10),
              secondYellows: parseInt(row['Second Yellows'], 10),
              goalsScored: parseInt(row['Goals scored'], 10),
              penaltiesScored: parseInt(row['Penalties scored'], 10),
              ownGoals: parseInt(row['Own goals'], 10),
              goalsConceded: parseInt(row['Goals conceded while player on pitch'], 10),
              tackles: parseInt(row.Tackles, 10),
              interceptions: parseInt(row.Interceptions, 10),
              recoveries: parseInt(row.Recoveries, 10),
              clearances: parseInt(row.Clearances, 10),
              successfulTackles: parseInt(row['Successful tackles'], 10),
              unsuccessfulTackles: parseInt(row['Unssuccessful tackles'], 10),
              lastMan: parseInt(row['Last man'], 10),
              successfulDuels: parseInt(row['Successful duels'], 10),
              duelsLost: parseInt(row['Duels lost'], 10),
              successfulAerialChallenges: parseInt(row['Successful aerial challenges'], 10),
              unsuccessfulAerialChallenges: parseInt(row['Unsuccessful aerial challenges'], 10),
              offsides: parseInt(row.Offsides, 10),
              foulsSuffered: parseInt(row['Fouls suffered'], 10),
              foulsCommitted: parseInt(row['Fouls committed'], 10),
              penaltiesWon: parseInt(row['Penalties won'], 10),
              penaltiesGivenAway: parseInt(row['Penalties given away'], 10),
              handballsCommitted: parseInt(row['Handballs committed'], 10),
              foulsPerCard: parseInt(row['Fouls committed per card'], 10),
              shots: parseInt(row.Shots, 10),
              shotsOnTarget: parseInt(row['Shots on target'], 10),
              assists: parseInt(row.Assists, 10),
              successfulDribbles: parseInt(row['Successful dribbles'], 10),
              unsuccessfulDribbles: parseInt(row['Unsuccessful dribbles'], 10),
              goalsScored: parseInt(row['Goals scored'], 10),
              fromInsideArea: parseInt(row['From inside the area'], 10),
              fromOutsideArea: parseInt(row['From outside the area'], 10),
              goalsWithLeftFoot: parseInt(row['Goals with left foot'], 10),
              goalsWithRightFoot: parseInt(row['Goals with right foot'], 10),
              penaltiesScored: parseInt(row['Penalties scored'], 10),
              goalsWithHeader: parseInt(row['Goals scored with header'], 10),
              goalsFromSetPiece: parseInt(row['Goals from set piece'], 10),
              crosses: parseInt(row.Crosses, 10),
              corners: parseInt(row.Corners, 10),
              tackles: parseInt(row.Tackles, 10),
              duels: parseInt(row.Duels, 10),
              manToManDuels: parseInt(row['Man-to-man duels'], 10),
              aerialDuels: parseInt(row['Aerial duels'], 10),
              passes: parseInt(row.Passes, 10),
              shortPasses: parseInt(row['Short passes'], 10),
              longPasses: parseInt(row['Long passes'], 10),
              throughBalls: parseInt(row['Through balls'], 10),
              goalsPerAttempt: parseFloat(row['Goals scored per attempt'])
            };

            jugadores.push(jugador);
          })
          .on('end', async () => {
            try {
              await Jugador.deleteMany({});
              await Jugador.insertMany(jugadores);
              console.log('Datos de jugadores cargados');
            } catch (error) {
              console.error('Error cargando datos de jugadores:', error);
            } finally {
              mongoose.connection.close();
            }
          });
      }
    });
}

loadInitialData();
