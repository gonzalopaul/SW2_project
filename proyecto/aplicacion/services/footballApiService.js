const axios = require('axios');
const xml2js = require('xml2js');

const API_KEY = 'dbf8f0226emsh93973727daf2cecp144a7cjsn8010ba980386';
const API_HOST = 'api-football-v1.p.rapidapi.com';

const getTopScorersJSON = async (league, season) => {
  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
    params: { league, season },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data from the external API');
  }
};

const getTopScorersXML = async (league, season) => {
  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
    params: { league, season },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
      'Accept': 'application/xml'
    }
  };

  try {
    const response = await axios.request(options);
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/xml')) {
      const result = await xml2js.parseStringPromise(response.data, { mergeAttrs: true });
      return result;
    } else {
      throw new Error('Received content is not in XML format');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data from the external API');
  }
};

module.exports = {
  getTopScorersJSON,
  getTopScorersXML
};
