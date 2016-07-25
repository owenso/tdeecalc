'use strict'

const config = require('../../config/config');
const pg = require('pg');
const bcrypt = require('bcrypt');


exports.newUser = function(body, callback) {
    let user = body;
    bcrypt.hash(user.password, 10, function(err, hash) {
        let encryptedPass = hash;
        let client = new pg.Client(config.pgConnectionString);
        client.connect();
        client.query(`INSERT INTO users (id, username, firstname, password, lastname, email, mfp_username) VALUES (uuid_generate_v1mc(), '${user.username}', '${user.firstname}', '${encryptedPass}', '${user.lastname}', '${user.email}', '${user.mfpUsername}') RETURNING * ;
        `, function(err, entry) {
            client.end();
            if (err) {
                err.statusCanary = "FAIL"
                console.log(err)
                callback(err)
            } else {
                console.log(entry)
                callback(entry.rows[0])
            }
        });
    })
}
exports.userLogin = function(body, callback) {
    let client = new pg.Client(config.pgConnectionString);
    client.connect();
    client.query(`SELECT * FROM users WHERE username = '${body.username}';`, function(err, user) {
        client.end();
            if (user.rows[0]) {
            bcrypt.compare(body.password, user.rows[0].password, function(err, res) {
                if (res) {
                    callback(user.rows[0]);

                } else {
                    let response = {
                        error:true,
                        message:"Password Incorrect"
                    }
                    callback(response);
                }
            });
        } else {
            let response = {
                error:true,
                message:"User not found"
            }
        callback(response);
        }
    })
}
    // userProfile: function(id, callback) {
    //     db.find('users', 'id', id, function(user) {
    //         callback(user);
    //     });
    // },
    // subCount: function(id, callback) {
    //     db.find('users', 'id', id, function(user) {
    //         db.updateOne('users', 'submissions', (user[0].submissions + 1), user[0].id, function(updated) {
    //             callback(updated);
    //         });
    //     });
    // },
    // getUsersById: function(cb) {
    //     pg.connect(dbUrl, function(err, client, done) {
    //         client.query('SELECT *  FROM users INNER JOIN requests ON users.id=requests.users_id;', function(err, result) {
    //             done();
    //             cb(result.rows);
    //         });
    //     });
    //     // this.end();
    // },
