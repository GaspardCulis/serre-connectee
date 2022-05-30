
const arrosage_prompt = document.getElementById('arrosage_prompt');
const select_mode_arrosage = document.getElementById('select_mode_arrosage');
const hourly_mode = document.getElementById('hourly_mode');
const daily_mode = document.getElementById('daily_mode');
const time_of_day_input = document.getElementById('time_of_day');
const hour_input = document.getElementById('hour');
const ml_input = document.getElementById('ml');
const ml_field= document.getElementById('ml_field');

const temp_adjust = document.getElementById('temp_adjust');
const temp_adjust_value = document.getElementById('temp_adjust_value');
const humid_adjust = document.getElementById('humid_adjust');
const humid_adjust_value = document.getElementById('humid_adjust_value');

const apply_changes_btn = document.getElementById('apply_changes_btn');

const horloge_gif = document.getElementById('horloge_gif');
const error_gif = document.getElementById('error_gif');

horloge_gif.style.display = 'none';
error_gif.style.display = 'none';

apply_changes_btn.style.display = 'none';

set_initial_values()

time_of_day_input.addEventListener('change', _on_config_change);
hour_input.addEventListener('change', _on_config_change);
ml_input.addEventListener('change', _on_config_change);
temp_adjust_value.addEventListener('change', _on_config_change);
humid_adjust_value.addEventListener('change', _on_config_change);

function _on_apply_changes_btn_click() {
    sendData({
        mode: select_mode_arrosage.value,
        hour: parse_hour(hour_input.value),
        time_of_day: parse_hour(time_of_day_input.value, ':'),
        ml: ml_input.value,
        temp_adjust: temp_adjust.value,
        temp_adjust_value: temp_adjust_value.value,
        humid_adjust: humid_adjust.value,
        humid_adjust_value: humid_adjust_value.value,
    }, "/config/arrosage_auto", _on_server_response, _on_server_error);
}

function _on_server_response() {
    apply_changes_btn.style.display = 'none';
    horloge_gif.style.display = 'flex';
    setTimeout(() => {
        horloge_gif.style.display = 'none';
    }, 1500);
}

function _on_server_error() {
    apply_changes_btn.style.display = 'none';
    error_gif.style.display = 'flex';
    setTimeout(() => {
        error_gif.style.display = 'none';
    }, 1500);
}

function _on_config_change() {
    apply_changes_btn.style.display = 'block';
    update_mode();
}

function set_initial_values() {
    select_mode_arrosage.value = document.getElementById('val_auto_mode').innerText.replace(/\s/g, '');
    let time = document.getElementById('val_time_of_day').innerText.replace(/\s/g, '');
    time_of_day_input.value = `${Math.floor(time/60)}:${time%60}`;
    let time2 = document.getElementById('val_hour').innerText.replace(/\s/g, '');
    if (time2%60) {
        hour_input.value = `${Math.floor(time2/60)}h${time2%60}`;
    } else {
        hour_input.value = `${Math.floor(time2/60)}`;
    }
    ml_input.value = document.getElementById('val_ml').innerText.replace(/\s/g, '');

console.log(document.getElementById('val_temp_adjust_value').innerText)

    temp_adjust.value = document.getElementById('val_temp_adjust').innerText.replace(/\s/g, '');
    temp_adjust_value.value = document.getElementById('val_temp_adjust_value').innerText.replace(/\s/g, '');
    humid_adjust.value = document.getElementById('val_humid_adjust').innerText.replace(/\s/g, '');
    humid_adjust_value.value = document.getElementById('val_humid_adjust_value').innerText.replace(/\s/g, '');
    

    update_mode();
}

function update_mode() {
    if (select_mode_arrosage.value == 'hourly') {
        hourly_mode.style.display = 'block';
        daily_mode.style.display = 'none';
        ml_field.style.display = 'flex';
        arrosage_prompt.innerHTML = "Arrosage automatique toutes les "
    } else if (select_mode_arrosage.value == 'daily') {
        daily_mode.style.display = 'flex';
        hourly_mode.style.display = 'none';
        ml_field.style.display = 'flex';
        arrosage_prompt.innerHTML = "Arrosage automatique tous les "
    } else {
        hourly_mode.style.display = 'none';
        daily_mode.style.display = 'none';
        ml_field.style.display = 'none';
        arrosage_prompt.innerHTML = "Arrosage automatique"
    }
}

update_mode()


