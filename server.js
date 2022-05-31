const express = require('express');
const cookieParser = require('cookie-parser');
const { reboot } = require('./scripts/iface');
const daemon = require('./scripts/daemon');

const login = require("./routes/login");
const infos = require("./routes/infos");
const config = require("./routes/config");
const settings = require("./routes/settings");
const post = require("./routes/post");

const Utils = require("./scripts/Utils");

const PORT=80
const app = express();

app.set('view engine', 'ejs');
app.use(cookieParser("secret"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(checkLogin);
app.use("/login", login);
app.use("/infos", infos);
app.use("/config", config);
app.use("/settings", settings);
app.use("/post", post);

function checkLogin(req, res) {
    if (! (Utils.isLogged(req.signedCookies) | req.url=="/login")) {
        res.redirect("/login");
    } else {
        req.next();
    }
}

app.get('/', (req, res) => {
    res.redirect("/login");
})

app.get('/disconnect', (req, res) => {
    let database = Utils.getDatabase();
    let log_hash = req.signedCookies.log_hash;
    let i = 0;
    for(let login of database.logins) {
        if(login.hash==log_hash) {
            database.logins[i].expired = true;
        }
        i++;
    }
    Utils.storeDatabase(database);
    Utils.clearExpiredLogins();
    res.redirect("/login");
})

app.get("/reboot", (req, res) => {
    reboot().then(response => {
        res.sendStatus(200);
    }).catch(error => {
        res.sendStatus(500);
    });
})

daemon.start();

app.listen(PORT);
console.log("Server started on http://localhost:"+PORT);

