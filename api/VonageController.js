const { getPhonesList, displayInboundSms, isOriginalPhoneNumber, displayInboundDtmf } = require("./phone-utils");
const { sendSms, sendResponseSms } = require("./send-sms");
const { sendTts } = require("./send-tts");
const { WEBHOOKS_DTMF } = require("../config/urls");

module.exports = {
    handleInboundSms: function(request, response) {
        var params = Object.assign(request.query, request.body);
        displayInboundSms(params);
        response.status(204).send();

        var sender = params.msisdn;
        var message = params.text;

        if (isOriginalPhoneNumber(sender)) {
            var phones = getPhonesList();
            phones.forEach( phone => {
                sendSms(phone, message);
                sendTts(phone, message, [`${request.protocol}://${request.get('host')}${WEBHOOKS_DTMF}`]);
            });
        } else {
            sendResponseSms(sender, message);
        }
    },
    onInputResponse: function(request, response) {
        var params = Object.assign(request.query, request.body);
        displayInboundDtmf(params);
        response.status(204).send();

        /* TODO: send response back to original phone, how to get sender¿? using uuid from tts? 
            -> the inboundDtmf has a from and to parameters (use the to param to know the other phone)
        var sender = ??;
        var dtmfResponse = params.dtmf.digits;

        sendResponseSms(sender, dtmfResponse);*/
    }
}

/*Inbound DTMF:
{
    speech: { error: 'Speech was not enabled' },
    dtmf: { digits: '1', timed_out: false },
    from: 'NEXMO phone',
    to: 'the phone number that received the tts message',
    uuid: '---',
    conversation_uuid: '---',
    timestamp: '2020-06-28T18:01:06.265Z'
}*/