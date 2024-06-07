const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

const API_KEY = '5ed3c676-6a49-43d6-98f8-fa11f2e3d0a1';
const API_URL = 'https://api.balldontlie.io/v1/teams';

router.get('/fetch_teams', async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { 'Authorization': API_KEY },
            responseType: 'text' // To handle XML response as text
        });

        // Convert XML to JSON
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to parse XML' });
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
});

module.exports = router;