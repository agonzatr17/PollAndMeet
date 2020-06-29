const { PHONE_NUMBERS, ORIGINAL_NUMBER } = require('../config/config');
require('../config/config');

exports.getPhonesList = function() {
    return PHONE_NUMBERS.split(',');
}

exports.displayInboundSms = function(params) {
    console.log('\nInbound SMS:');
    console.log(params);
    console.log("--------------------");
}

exports.displayInboundDtmf = function(params) {
    console.log('\nInbound DTMF:');
    console.log(params);
    console.log("--------------------");
}

exports.isOriginalPhoneNumber = function(number) {
    return number == ORIGINAL_NUMBER;
}

exports.getDtmfResponse = function(digit) {
    switch(digit) {
        case "1":
            return "Confirm";
        case "2":
            return "Deny";
        default:
            return "";
    }
}