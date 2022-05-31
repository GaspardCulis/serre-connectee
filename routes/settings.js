const express = require('express');
const router = express.Router();
const { wifi_connect, wifi_remove } = require('../scripts/iface');

router.get('/', (req, res) => {
    res.render("settings");
})

router.post('/wifi/connect', (req, res) => {
    var ssid = req.body.ssid;
    var key = req.body.key;
    wifi_connect(ssid, key).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        res.sendStatus(500);
    });
})

router.post('/wifi/remove', (req, res) => {
    var ssid = req.body.ssid;
    wifi_remove(ssid).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        res.sendStatus(500);
    });
});

module.exports = router;