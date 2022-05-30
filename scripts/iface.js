const axios = require('axios');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/serre/`;

async function get_humid_temp(capteur) {
    const url = BASE_URL+"humid_temp?cpt="+capteur;
    let response = await axios.get(url);
    return response.data;
}

async function get_water_level() {
    const url = BASE_URL+"niveau_eau";
    let response = await axios.get(url);
    return response.data;
}

async function arroser(ml) {
    const url = BASE_URL+"arroser";
    let response = await axios.post(url, {ml: ml});
    return response.data;
}


exports.get_humid_temp = get_humid_temp;
exports.get_water_level = get_water_level;
exports.arroser = arroser;
