const sha256 = require("crypto-js/sha256");
const fs = require('fs');
const { exec } = require('child_process');
const { rejects } = require("assert");

function getDataBase() {
    return JSON.parse(fs.readFileSync('./data/database.json'));
}

function storeDatabase(database) {
    fs.writeFileSync('./data/database.json', JSON.stringify(database, null, "\t"))
}

function isLogged(signedCookies) {
    checkLoginsExpiration();
    let database = getDataBase();
    return database.logins.some((el)=>{return el.hash==signedCookies.log_hash & !el.expired});
}

function checkLoginsExpiration() {
    let database = getDataBase();
    let date = new Date();
    let i = 0;
    for(let login of database.logins) {
        let login_date = new Date(database.logins[i].timestamp);
        let max_age = database.logins[i].max_age;
        if(login_date.getTime() + max_age < date.getTime()) {
            database.logins[i].expired = true;
        }
        i++;
    }
    storeDatabase(database);
    clearExpiredLogins();
}

function clearExpiredLogins() {
    let database = getDataBase();
    let new_database = [];
    for(let login of database.logins) {
        if(! login.expired) {
            new_database.push(login);
        }
    }
    database.logins = new_database;
    storeDatabase(database);
}

function isPasswordValid(password) {
    return password.length>=4;
}

function changePassword(new_pass) {
    let database = getDataBase();
    database.password = sha256(new_pass).toString();
    database.logins = [];
    storeDatabase(database);
}

function getDateAndTime() {
    let date = new Date();
    let time = "" + (date.getHours()<10 ? "0" : "") + date.getHours() + "h" + (date.getMinutes()<10 ? "0" : "") + date.getMinutes();
    let date_out = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][date.getDay()] + " " + date.getDate();
    date_out += " "+["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"][date.getMonth()];

    return [date_out, time];
    
}


async function executePythonFunction(script_path, script_name, function_name, args) {
    return new Promise(resolve => {
        script_path = script_path.replace("/","\\")
        let command = "python -c \"import sys; sys.path.append('"+(process.cwd()+script_path).replace("\\", "\\\\")+"');"
        command += "print(sys.path);"
        command += "import "+script_name.replace(".py","")+" as s; print(s."+function_name+"("
        for(let arg of args) {
            if (typeof arg == "string") {
                command += "'"+arg+"',"
            } else {
                command += arg + ","
            }
        }
        if (args.length) {
            command = command.substring(0, command.length - 1)
        }
        command += "));\""
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve({results: null, error: error});
            } else {
                let splited = stdout.split("]")[1];
                splited = splited.substring(2, splited.length - 2);
                splited = splited.replace(" ", "");
                resolve({results: parsePythonResult(splited), error: null});
            }
        })    
    });
}

function parsePythonResult(result) {
    if (result == undefined) {
        return null;
    } else if ( result.startsWith("(") && result.endsWith(")") ) {
        let result_array = result.substring(1, result.length - 1).split(",");
        let new_array = [];
        for(let el of result_array) {
            new_array.push(parsePythonResult(el));
        }
        return new_array;
    } else if ( result.startsWith("'") && result.endsWith("'") ) {
        return result.substring(1, result.length - 1);
    } else {
        let parsed = parseFloat(result);
        if (isNaN(parsed)) {
            return result;
        } else {
            return parsed;
        }
    }
}

module.exports = {
    sha256: function (text) {
        return sha256(text).toString()
    },
    getDataBase: getDataBase,
    storeDatabase: storeDatabase,
    isLogged: isLogged,
    clearExpiredLogins: clearExpiredLogins,
    changePassword: changePassword,
    isPasswordValid: isPasswordValid,
    getDateAndTime: getDateAndTime,
    executePythonFunction: executePythonFunction
}