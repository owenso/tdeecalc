var root = '/api/v1/mfp/';
var mfpController = require('../controllers/mfp.api.controller');

module.exports = function(app) {
    app.get(root + 'new/:mfpUsername', mfpController.newScrape);

    app.get(root + 'data/:mfpUsername', mfpController.getUserDataByMfpUsername);
};
