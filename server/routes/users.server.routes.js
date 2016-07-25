const root = '/users/';
const usersController = require('../controllers/users.server.controller');

module.exports = function(app) {
    app.post(root + 'new', usersController.newLocalUser);

    app.post(root + 'login', usersController.localLogin);
};
