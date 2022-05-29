const ml_input_field = document.getElementById("ml");
const plant_gif = document.getElementById("plant_gif");
const error_gif = document.getElementById("error_gif");

plant_gif.style.display = "none";
error_gif.style.display = "none";

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