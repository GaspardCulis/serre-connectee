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

async function wifi_connect(ssid, key) {
    const url = BASE_URL+"wifi/connect";
    let response = await axios.post(url, {ssid: ssid, key: key});
    return response.data;
}

async function wifi_remove(ssid) {
    const url = BASE_URL+"wifi/remove";
    let response = await axios.post(url, {ssid: ssid});
    return response.data;
}

async function reboot() {
    const url = BASE_URL+"reboot";
    let response = await axios.get(url);
    return response.data;
}


exports.get_humid_temp = get_humid_temp;
exports.get_water_level = get_water_level;
exports.arroser = arroser;
exports.wifi_connect = wifi_connect;
exports.reboot = reboot;
