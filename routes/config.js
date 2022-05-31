const express = require('express');
const router = express.Router();
const daemon = require('../scripts/daemon');
const { getDatabase, storeDatabase } = require('../scripts/Utils');

router.get('/', (req, res) => {
    let db = getDatabase();
    res.render("config", {
        auto_mode: db.config.arrosage_auto.mode,
        hour: db.config.arrosage_auto.hour,
        time_of_day: db.config.arrosage_auto.time_of_day,
        ml: db.config.arrosage_auto.ml,
        temp_adjust: db.config.ideal_temp.enabled,
        temp_adjust_value: db.config.ideal_temp.value,
        humid_adjust: db.config.ideal_humid.enabled,
        humid_adjust_value: db.config.ideal_humid.value,
    });
})

router.post('/arrosage_auto', (req, res) => {
    var mode = req.body.mode;
    var hour = parseFloat(req.body.hour);
    var time_of_day = parseFloat(req.body.time_of_day);
    var ml = parseFloat(req.body.ml);

    var temp_adjust = req.body.temp_adjust;
    var temp_adjust_value = parseFloat(req.body.temp_adjust_value);
    var humid_adjust = req.body.humid_adjust;
    var humid_adjust_value = parseFloat(req.body.humid_adjust_value);
    
    var valid = ["hourly", "daily", "disabled"].indexOf(mode) != -1;
    valid = valid && !isNaN(hour) && hour > 0
    valid = valid & !isNaN(time_of_day) & time_of_day < 24*60;
    valid = valid && !isNaN(ml) && ml > 0;
    valid = valid && !isNaN(temp_adjust_value);
    valid = valid && !isNaN(humid_adjust_value) && humid_adjust_value >= 0 && humid_adjust_value <= 100;

    if (!valid) {
        res.sendStatus(400);
        console.log(`${new Date()} : Invalid config : ${mode} , ${hour} , ${time_of_day} , ${ml}`);
        return;
    }

    let db = getDatabase();
    db.config.arrosage_auto.mode = mode;
    db.config.arrosage_auto.hour = hour;
    db.config.arrosage_auto.time_of_day = time_of_day;
    db.config.arrosage_auto.ml = ml;

    db.config.ideal_temp.enabled = temp_adjust;
    db.config.ideal_temp.value = temp_adjust_value;
    db.config.ideal_humid.enabled = humid_adjust;
    db.config.ideal_humid.value = humid_adjust_value;
    storeDatabase(db);
    daemon.update();

    res.send("OK");
});

module.exports = router;