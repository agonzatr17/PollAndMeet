const { PHONE_NUMBERS } = require('../config/config');
require('../config/config');

exports.getPhonesList = function() {
    return PHONE_NUMBERS.split(',');
}

exports.displayInboundSms = function(params) {
    console.log('Inbound SMS:');
    console.log(params);
    console.log("--------------------");
}