var mfp = require('mfp');
var fs = require('fs');
var moment = require ('moment');
var connectionTest = require('../config/mfpConnectionTest.js')();



var yesterday = moment().subtract(1, 'days')
mfp.fetchSingleDate('snewo531', moment(yesterday).format('YYYY-MM-DD'), 'all', function(data){
    if (data) {
        console.log(data);
    } else {
        var error = moment().format('x') + ': Unable to scrape data for ' + yesterday;
        fs.appendFile('/logs/errorLog.txt', error , function (err) {
            if (err) {
                console.log('cant log errors');
            };
        });
    }
});
