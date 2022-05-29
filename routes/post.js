const express = require('express');
const Utils = require("../scripts/Utils");
const router = express.Router();

router.post('/settings', (req, res) => {
    let setting = req.body.setting;
    console.log("Changing setting "+setting);
    if (setting=="password") {
        let new_pass = req.body.new_pass;
        if(Utils.isPasswordValid(new_pass)) {
            Utils.changePassword(new_pass);
            res.send('ok');
        } else {
            res.send('error');
        }
    } else {
        res.sendStatus(400);
    }
    
})

module.exports = router;