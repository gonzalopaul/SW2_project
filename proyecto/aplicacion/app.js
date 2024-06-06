  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const bodyParser = require('body-parser');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Conexión a MongoDB
  mongoose.connect('mongodb://localhost:27017/futbol', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Conexión a MongoDB exitosa');
  }).catch((err) => {
    console.error('Error conectándose a MongoDB', err);
  });

  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static('public'));

  // Rutas
  app.use('/equipos', require('./routes/equipos'));
  app.use('/partidos', require('./routes/partidos'));
  app.use('/topscorers', require('./routes/topScorers')); 
  app.use('/api', require('./routes/api'));

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });