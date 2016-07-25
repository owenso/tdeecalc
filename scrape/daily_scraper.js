'use strict'
const mfp = require('mfp');
const fs = require('fs');
const moment = require('moment');
const pg = require('pg');
const _ = require('underscore');
const config = require('../config/config');
const connectionTest = require('../config/mfpConnectionTest.js')();
const crypto = require('crypto');
const Pool = require('pg-pool');
process.env.NODE_ENV = process.env.NODE_ENV || 'local';


let yesterday = moment().subtract(1, 'days');

let scrapeAndInsert = function(user, client, done) {
    mfp.fetchSingleDate(user.mfp_username, moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
        if (data) {
            let dataSet = _.values(data);
            data.date = moment(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
            let dataDate = dataSet.pop();
            let idHash = crypto.createHash('md5').update(data.date + user.mfp_username).digest("hex");
            client.query('INSERT INTO nutrition (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) VALUES (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',\'' + user.id + '\') ON CONFLICT (id) DO UPDATE SET (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) = (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',\'' + user.id + '\')', function(err, result) {
                done();
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

let usersClient = new pg.Client(config.pgConnectionString);
usersClient.connect();
let query = usersClient.query('SELECT * FROM users WHERE mfp_username IS NOT NULL', function(err, user) {
    usersClient.end();
    let pool = new Pool(config.pgPoolSettings);
    pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        for (let i=0; i<user.rows.length;i++){
            console.log('scraping user #'+ i)
            scrapeAndInsert(user.rows[i], client, done);
        }
    })
    pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack)
    })
});
