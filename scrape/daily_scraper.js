var mfp = require('mfp');
var fs = require('fs');
var moment = require('moment');
var pg = require('pg');
var _ = require('underscore');

process.env.NODE_ENV = process.env.NODE_ENV || 'local';
var config = require('../config/config');
var connectionTest = require('../config/mfpConnectionTest.js')();

var yesterday = moment().subtract(1, 'days');


var scrapeAndInsert = function(user) {
    mfp.fetchSingleDate(user.mfp_username, moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
        if (data) {
            var dataSet = _.values(data);
            data.date = moment(data.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
            var dataDate = dataSet.pop();
            client.query('INSERT INTO nutrition (calories,carbs,fat,protein,cholesterol,sodium,sugar,fiber,date_entered,users_id) VALUES (' + dataSet + ', \'' + dataDate + '\',\'' + user.id + '\')', function(err, result) {
                client.end();
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
        } else {
            var error = moment().format('x') + ': Unable to scrape data for ' + yesterday;
            fs.appendFile('/logs/errorLog.txt', error , function (err) {
                if (err) {
                    console.log('cant log errors');
                }
            });
        }
    });
};

var client = new pg.Client(config.pgConnectionString);
client.connect();
var query = client.query('SELECT * FROM users WHERE mfp_username IS NOT NULL', function(err, user) {
    for (var i=0; i<user.rows.length;i++){
        scrapeAndInsert(user.rows[i]);
    }
});
