const root = '/api/v1/mfp/';
const mfpController = require('../../controllers/api/mfp.api.controller');

module.exports = function(app) {
    app.get(root + 'new/:mfpUsername', mfpController.newScrape);

    app.get(root + 'data/:mfpUsername', mfpController.getUserDataByMfpUsername);
};
