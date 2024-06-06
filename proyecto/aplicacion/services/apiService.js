const axios = require('axios');

const apiBaseUrl = 'https://api.balldontlie.io/v1';

exports.getData = async (endpoint) => {
  try {
    const response = await axios.get(`${apiBaseUrl}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}`, error);
    throw error;
  }
};