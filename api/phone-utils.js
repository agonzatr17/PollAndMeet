const { PHONE_NUMBERS, ORIGINAL_NUMBER } = require('../config/config');
require('../config/config');

exports.getPhonesList = function() {
    return PHONE_NUMBERS.split(',');
}

exports.displayInboundSms = function(params) {
    console.log('Inbound SMS:');
    console.log(params);
    console.log("--------------------");
}

exports.isOriginalPhoneNumber = function(number) {
    return number == ORIGINAL_NUMBER;
}