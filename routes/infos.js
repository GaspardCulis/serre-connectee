const express = require('express');
const router = express.Router();
const { getDateAndTime, executePythonFunction } = require("../scripts/Utils"); 

async function get_infos() {
    let res_ext = await executePythonFunction("/python", "iface", "get_humid_temp", ["ext"]);
    let results_ext = res_ext.results;
    let error_ext = res_ext.error;
    let res_int = await executePythonFunction("/python", "iface", "get_humid_temp", ["int"]);
    let results_int = res_int.results;
    let error_int = res_int.error;

    let temp_ext, hum_ext, temp_int, hum_int;
    if (error_ext) {
        temp_ext = "Error";
        hum_ext = "Error"
    } else {
        console.log("ext : ", results_ext);
        temp_ext = results_ext[0];
        hum_ext = results_ext[1];
    }
    if (error_int) {
        temp_int = "Error";
        hum_int = "Error"
    } else {
        console.log("int : ", results_int);
        temp_int = results_int[0];
        hum_int = results_int[1];
    }
    let date = getDateAndTime();

    return {
        temp_ext: temp_ext,
        hum_ext: hum_ext,
        temp_int: temp_int,
        hum_int: hum_int,
        date: date
    };
}

async function test() {
    let {results, error} = await executePythonFunction("/python", "teste", "test", [1,2,"bite"])
    console.log(results, error);
}

router.get('/', (req, res) => {
    get_infos().then(infos => {
        res.render("infos", infos);
    });
    
})

module.exports = router;