const axios = require('axios');

exports.getTopScorers = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
        params: {
            league: '39',  // Premier League
            season: '2023'
        },
        headers: {
            'X-RapidAPI-Key': 'dbf8f0226emsh93973727daf2cecp144a7cjsn8010ba980386',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data.response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the external API' });
    }
};
