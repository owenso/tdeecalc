const config = require('../../config/config');
const pg = require('pg');

exports.saveData = function(req, res) {
    const crypto = require('crypto');
    let data = req.body
    console.log(req.body)
    let idHash = crypto.createHash('md5').update(req.body.date + req.body.userId).digest("hex");
    console.log(idHash)
    let client = new pg.Client(config.pgConnectionString);
    client.connect();
    console.log(`INSERT INTO bodytracking (id,bodyfat,weight,date_entered,users_id) VALUES (\'${idHash}\', ${data.bodyfat}, ${data.weight}, \'${data.date}\', \'${data.userId}\')`)
    var query = client.query(`INSERT INTO bodytracking (id,bodyfat,weight,date_entered,users_id) VALUES (\'${idHash}\', ${data.bodyfat}, ${data.weight}, \'${data.date}\', \'${data.userId}\')`, function(err, entry) {
        client.end();
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            console.log(entry);
            res.sendStatus(200);
        }
    });
}
