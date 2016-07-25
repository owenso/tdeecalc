'use strict'

const config = require('../../config/config');
const pg = require('pg');
const User = require ('../models/user');
const jwt = require('jsonwebtoken');


exports.newLocalUser = function(req, res) {
    User.newUser(req.body, function(user) {
        if (user && user.statusCanary === "FAIL") {
            res.status(500).send(user);
        } else {
            let token = jwt.sign(user, config.jwtSecret);
            return res.json({
                success: true,
                token: token
            });
            //res.json(user);
        }
    })
}

exports.localLogin = function(req, res) {
    User.userLogin(req.body, function(user) {
        if (user.error) {
            res.status(500).send(user.message)
        } else {
            let token = jwt.sign(user, config.jwtSecret);
            return res.json({
                success: true,
                token: token
            });
        }
    })
}
