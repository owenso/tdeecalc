const root = '/api/v1/mfp/';
const bodyTrackingController = require('../controllers/bodytracking.api.controller');

module.exports = function(app) {
    app.post(root + 'save', bodyTrackingController.saveData);
};
