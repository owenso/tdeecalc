'use strict';

const config = require('../../config/config');
const _ = require('underscore');
const pg = require('pg');

exports.newScrape = function(req, res) {
    const mfp = require('mfp');
    const fs = require('fs');
    const moment = require('moment');
    const Pool = require('pg-pool');
    const crypto = require('crypto');

    (function fetchMonth() {
        let monthAgo = moment().subtract(1, 'months');
        let yesterday = moment().subtract(1, 'days');

        mfp.fetchDateRange(req.params.mfpUsername, moment(monthAgo).format('YYYY-MM-DD'), moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
            if (data) {
                console.log(config.pgPoolSettings)
                let pool = new Pool(config.pgPoolSettings);
                //let client = new pg.Client(config.pgConnectionString);
                //client.connect();
                console.log(pool)
                pool.connect(function(err, client, done) {
                  if(err) {
                    return console.error('error fetching client from pool', err);
                  }
                //   client.query('SELECT $1::int AS number', ['1'], function(err, result) {
                //     //call `done()` to release the client back to the pool
                //     done();
                //
                //     if(err) {
                //       return console.error('error running query', err);
                //     }
                //     console.log(result.rows[0].number);
                //     //output: 1
                //   });
                    _.each(data.data, function(dayNutrition) {
                        let dataSet = _.values(dayNutrition);
                        dayNutrition.date = moment(dayNutrition.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
                        let idHash = crypto.createHash('md5').update(dayNutrition.date + req.params.mfpUsername).digest("hex");
                        let dataDate = dataSet.pop();
                        console.log('inserting')

                        client.query('INSERT INTO nutrition (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) VALUES (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',(SELECT id FROM users WHERE mfp_username = \'' + req.params.mfpUsername + '\')) ON CONFLICT (id) DO UPDATE SET (id,calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) = (\'' + idHash + '\',' + dataSet + ', \'' + dataDate + '\',(SELECT id FROM users WHERE mfp_username = \'' + req.params.mfpUsername + '\'))', function(err, result) {
                            console.log('something happened')
                            done();
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(result);
                            }
                        });
                    });
                });
                pool.on('error', function (err, client) {
                    console.error('idle client error', err.message, err.stack)
                })
                //client.end();
                res.sendStatus(200);
            } else {
                let error = moment().format('x') + ': Unable to scrape data for ' + yesterday;
                fs.appendFile('/logs/errorLog.txt', error , function (err) {
                    if (err) {
                        console.log('cant log errors');
                    }
                });
                res.sendStatus(500);
            }
        });
    }());
};


exports.getUserDataByMfpUsername = function(req, res) {
    let client = new pg.Client(config.pgConnectionString);
    client.connect();
    let query = client.query('SELECT * FROM nutrition WHERE users_id = (SELECT id FROM users WHERE mfp_username = \''+req.params.username+'\');', function(err, data) {
        client.end();
        res.json(data.rows);
    });

};
