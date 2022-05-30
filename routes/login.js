const express = require('express');
const fs = require('fs');
const Utils = require("../scripts/Utils");
const router = express.Router();

const max_login_age = 3600000;

router.get('/', (req, res) => {
    if (Utils.isLogged(req.signedCookies)) {
        res.redirect("/infos");
    } else {
        res.render("login");
    }
})

router.post('/', (req, res) => {
    handleLogin(req, res);
})

function handleLogin(req, res) {
    let hash = Utils.sha256(req.body.password);
    let database = Utils.getDatabase();
    let storedHash = database.password;
    if (hash == storedHash) {
        var log_hash = Utils.sha256(Math.random().toString());
        
        database.logins.push({"hash":log_hash, "timestamp": new Date(), "max_age": max_login_age, "expired": false})
        Utils.storeDatabase(database);
        res.cookie('log_hash', log_hash, {maxAge: max_login_age, signed: true});
        res.redirect("/infos");
    } else {
        res.render("login", { error:"true" });
    }
}

module.exports = router;