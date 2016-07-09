var config = require('../../config/config');
var _ = require('underscore');
var pg = require('pg');

exports.newScrape = function(req, res) {
    var mfp = require('mfp');
    var fs = require('fs');
    var moment = require('moment');
    var Pool = require('pg-pool');

    (function fetchMonth() {
        var monthAgo = moment().subtract(1, 'months');
        var yesterday = moment().subtract(1, 'days');
        var pool = new Pool(config.pgPoolSettings);

        mfp.fetchDateRange(req.params.mfpUsername, moment(monthAgo).format('YYYY-MM-DD'), moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
            if (data) {
                var client = new pg.Client(config.pgConnectionString);
                //client.connect();
                _.each(data.data, function(dayNutrition) {
                    console.log('looploop');
                    var dataSet = _.values(dayNutrition);
                    dayNutrition.date = moment(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    var dataDate = dataSet.pop();
                    pool.query('INSERT INTO nutrition (calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) VALUES (' + dataSet + ', \'' + dataDate + '\', (SELECT id FROM users WHERE mfp_username = \'' + req.params.mfpUsername + '\'));', function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    });
                });
                //client.end();
                res.sendStatus(200);
            } else {
                var error = moment().format('x') + ': Unable to scrape data for ' + yesterday;
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
    var client = new pg.Client(config.pgConnectionString);
    client.connect();
    var query = client.query('SELECT * FROM nutrition WHERE users_id = (SELECT id FROM users WHERE mfp_username = \'snewo531\');', function(err, data) {
        client.end();
        res.json(data.rows);
    });

};
