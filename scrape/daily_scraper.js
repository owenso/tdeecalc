'use strict'
const mfp = require('mfp');
const fs = require('fs');
const moment = require('moment');
const pg = require('pg');
const _ = require('underscore');

process.env.NODE_ENV = process.env.NODE_ENV || 'local';
const config = require('../config/config');
const connectionTest = require('../config/mfpConnectionTest.js')();
const crypto = require('crypto');

let yesterday = moment().subtract(1, 'days');


let scrapeAndInsert = function(user) {
    mfp.fetchSingleDate(user.mfp_username, moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
        if (data) {
            let clientTwo = new pg.Client(config.pgConnectionString);
            let dataSet = _.values(data);
            data.date = moment(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
            let dataDate = dataSet.pop();
            let idHash = crypto.createHash('md5').update(data.date + user.mfp_username).digest("hex");
            clientTwo.query('INSERT INTO nutrition (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) VALUES (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',\'' + user.id + '\') ON CONFLICT (id) DO UPDATE SET (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) = (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',\'' + user.id + '\')', function(err, result) {
                clientTwo.end();
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
        } else {
            let error = moment().format('x') + ': Unable to scrape data for ' + yesterday;
            fs.appendFile('/logs/errorLog.txt', error , function (err) {
                if (err) {
                    console.log('cant log errors');
                }
            });
        }
    });
};

let client = new pg.Client(config.pgConnectionString);
client.connect();
let query = client.query('SELECT * FROM users WHERE mfp_username IS NOT NULL', function(err, user) {
    client.end();
    for (let i=0; i<user.rows.length;i++){
        scrapeAndInsert(user.rows[i]);
    }
});
