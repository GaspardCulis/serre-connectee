const ml_input_field = document.getElementById("ml");
const plant_gif = document.getElementById("plant_gif");
const error_gif = document.getElementById("error_gif");

const water_level_container = document.getElementById("water_level_container");
const water_level = document.getElementById("water_level");
const water_level_value = document.getElementById("water_level_value");

plant_gif.style.display = "none";
error_gif.style.display = "none";

let water_level_container_height = water_level_container.offsetHeight;
let niveau_eau = water_level_value.innerHTML.replace("%", "").replace(" ", "");
niveau_eau = parseFloat(niveau_eau);

if (!isNaN(niveau_eau)) {
    let water_level_height = water_level_container_height * niveau_eau / 101;
    water_level.style.height = water_level_height + "px";
} else {
    water_level.style.height = water_level_container_height + "px";
    water_level.style.backgroundColor = "red";
    water_level_value.innerHTML = "Error";
}

function _on_arroser_request() {
    _on_arroser_start();
    sendData({ml: ml_input_field.value}, "/infos/arroser", _on_arroser_update, _on_arroser_error);
}

function _on_arroser_update(response) {
    if (response=="DONE") {
        _on_arroser_over();
    } else if (response=="ERROR") {
        _on_arroser_error(500);
    }
}

function _on_arroser_start() {
    plant_gif.style.display = "block";
}

function _on_arroser_over() {
    plant_gif.style.display = "none";
}

function _on_arroser_error(code) {
    _on_arroser_over();
    error_gif.style.display = "block";
    setTimeout(() => {
        error_gif.style.display = "none";
    }, 2500);
}