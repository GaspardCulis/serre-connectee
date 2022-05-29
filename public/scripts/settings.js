const change_pass_button = document.getElementById("submit_new_pass");
const change_pass_input = document.getElementById("new_pass");

let new_pass;

change_pass_button.addEventListener("click", () => {
    if(!new_pass) {
        new_pass = change_pass_input.value;
        if (new_pass=="") {return}
        change_pass_input.value = "";
        change_pass_button.textContent = "Verifier";
    } else {
        if(change_pass_input.value==new_pass) {
            sendData({"setting":"password", "new_pass": new_pass}, "/post/settings", (response)=>{
                if(response=='ok') {
                    alert("Mot de passe changé !\nRedirection...");
                    window.location.href = "/login";
                } else {
                    alert('Mot de passe invalide');
                }
            },
             ()=>{
                 alert('Erreur.');
                });
        } else {
            alert("Les mots de passe ne correspondent pas.");
        }
        new_pass = "";
        change_pass_input.value = "";
        change_pass_button.textContent = "Changer";
    }
})


