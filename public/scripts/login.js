const login_field = document.getElementById("password");
const error = document.getElementById("error");

error.hidden = true;

function shake_login() {
    login_field.animate([
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(0px)' }
    ], {
        duration: 100,
        iterations: 5
    })
    login_field
}

if(error.innerText=="true") {
    shake_login();
    error.innerText=="false";
}