const { getDatabase } = require("../scripts/Utils");
const { arroser } = require("../scripts/iface");

var arrosage_interval;
var arrosage_timeout;

function start() {
    let config = getDatabase().config;
    if (config.arrosage_auto.mode=="hourly") {
        let wait_time = config.arrosage_auto.hour*60;
        console.log(`${new Date()} : Arrosage auto active en mode houly, toutes les ${wait_time} minutes`);
        arrosage_interval = setInterval(arrosage_auto_worker, wait_time*60*1000);
    } else if (config.arrosage_auto.mode=="daily") {
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();
        let wait_time = (config.arrosage_auto.time_of_day) - (hour*60 + minute);
        if (wait_time<0) {
            wait_time += 24*60;
        }
        arrosage_timeout = setTimeout(() => {
            arrosage_interval = setInterval(arrosage_auto_worker, 24*60*60*1000);
        }, wait_time*60*1000);
        
        
    }
}

function update() {
    if (arrosage_interval) {
        clearInterval(arrosage_interval);
    }
    if (arrosage_timeout) {
        clearTimeout(arrosage_timeout);
    }
    start();
}

function arrosage_auto_worker() {
    let ml = getDatabase().config.arrosage_auto.ml;
    arroser(ml).then(() => {
        console.log(`${new Date()} : Arrosage de ${ml} ml`);
    }).catch((err) => {
        console.log(`${new Date()} : Erreur pendant l'arrosage : ${err}`);
    }
    );
}

module.exports = {
    start,
    update,
};