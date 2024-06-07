const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const router = express.Router();
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

// Configurar la API
const API_KEY = '5ed3c676-6a49-43d6-98f8-fa11f2e3d0a1';
const API_URL = 'https://api.balldontlie.io/v1';

router.get('/teams', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/teams`, {
            headers: { 'Authorization': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({ error: 'Failed to fetch teams from API' });
    }
});

router.get('/players', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/players`, {
            headers: { 'Authorization': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).json({ error: 'Failed to fetch players from API' });
    }
});

router.get('/games', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/games`, {
            headers: { 'Authorization': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener partidos:', error);
        res.status(500).json({ error: 'Failed to fetch games from API' });
    }
});

app.use('/api', router);
app.use('/equipos', require('./routes/equipos'));
app.use('/partidos', require('./routes/partidos'));
app.use('/topscorers', require('./routes/topScorers')); 

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});