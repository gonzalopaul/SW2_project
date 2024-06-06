const axios = require('axios');

const apiBaseUrl = 'https://api.balldontlie.io/v1/players';

exports.getAllPlayers = async (req, res) => {
  try {
    const response = await axios.get(apiBaseUrl, {
      headers: {
        'Authorization': '5ed3c676-6a49-43d6-98f8-fa11f2e3d0a1'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Error fetching players', error: error.message });
  }
};