const express = require('express');
const router = express.Router();
const { getDateAndTime } = require("../scripts/Utils");
const iface = require('../scripts/iface');

async function get_infos() {
    let res_ext = ["Error", "Error"];
    let res_int = ["Error", "Error"];
    res_ext = await iface.get_humid_temp("ext").catch(err => {console.log(new Date()+" : Couldn't get external temp and humidity"); return ["Error", "Error"];});
    res_int = await iface.get_humid_temp("int").catch(err => {console.log(new Date()+" : Couldn't get internal temp and humidity"); return ["Error", "Error"];});
    
    let water_level = "Error";
    water_level = await iface.get_water_level().catch(err => {console.log(new Date()+" : Couldn't get water level"); return "Error";});
    
    let date = getDateAndTime();

    return {
        hum_ext: res_ext[0],
        temp_ext: res_ext[1],
        hum_int: res_int[0],
        temp_int: res_int[1],
        water_level: water_level,
        date: date
    };
}

router.get('/', (req, res) => {
    get_infos().then(infos => {
        res.render("infos", infos);
    });
    
})

router.post('/arroser', (req, res) => {
    var ml = parseFloat(req.body.ml);
    //check if ml is a number
    if (isNaN(ml)) {
        res.sendStatus(400); // Error 400: Bad Request
    } else {
        console.log(new Date() + " : executing arroser");
        iface.arroser(ml).then((result) => {
            res.send("DONE");
        }).catch((error) => {
            res.send("ERROR"); // Error 500: Internal Server Error
        });
    }
});
module.exports = router;