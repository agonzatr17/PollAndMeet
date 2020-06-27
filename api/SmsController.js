const { getPhonesList, displayInboundSms, isOriginalPhoneNumber } = require("./phone-utils");
const { sendSms, sendResponseSms } = require("./send-sms");
const { sendTts } = require("./send-tts");
const { ORIGINAL_NUMBER } = require("../config/config");

module.exports = {
    handleInboundSms: function(request, response) {
        const params = Object.assign(request.query, request.body);
        displayInboundSms(params);
        var sender = params.msisdn;
        var message = params.text;

        if (isOriginalPhoneNumber(sender)) {
            var phones = getPhonesList();
            phones.forEach( phone => {
                sendSms(phone, message);
                sendTts(phone, message);
            });
        } else {
            sendResponseSms(sender, message);
        }

        response.status(204).send();
    },
    // TTS testing endpoint (TODO: delete)
    sendTtsMessage: function(request, response) {
        sendTts(ORIGINAL_NUMBER, 'Join me');
        response.status(204).send();
    }
}