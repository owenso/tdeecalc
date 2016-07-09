var mfp = require('mfp');

module.exports = function() {
    mfp.apiStatusCheck(function(errors) {
        if (errors.length !== 0) {
            console.log('API ERROR');
            errors.forEach(function(error){
                console.log(error);
            });
        } else {
            console.log("MFP Connection Successful.");
        }
    });
}
;
