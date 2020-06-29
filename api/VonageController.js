const { getPhonesList, displayInboundSms, isOriginalPhoneNumber, displayInboundDtmf, getDtmfResponse } = require("./phone-utils");
const { sendSms, sendResponseSms } = require("./send-sms");
const { sendTts } = require("./send-tts");
const { WEBHOOKS_DTMF } = require("../config/urls");

module.exports = {
    // incoming messages are relayed to other phone/s depending on the sender phone number
    handleInboundSms: function(request, response) {
        try {
            var params = Object.assign(request.query, request.body);
            displayInboundSms(params);
            response.status(204).send();

            var sender = params.msisdn;
            var message = params.text;

            // if sender is the original phone number, we have to relay the message to the list of phone numbers
            // else we know it is a response message so we send the response back to the original phone
            if (isOriginalPhoneNumber(sender)) {
                var phones = getPhonesList();
                phones.forEach( phone => {
                    sendSms(phone, message);
                    sendTts(phone, message, [`${request.protocol}://${request.get('host')}${WEBHOOKS_DTMF}`]);
                });
            } else {
                sendResponseSms(sender, message);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    },
    // incoming response message from the tts call (after the user presses a digit) is sent back to the original phone
    onInputResponse: function(request, response) {
        try {
            var params = Object.assign(request.query, request.body);
            displayInboundDtmf(params);
            var sender;
            var dtmfResponse;

            // try to read the params from the post request
            try {
                sender = params.to;
                dtmfResponse = getDtmfResponse(params.dtmf.digits);
            } catch (error) {
                console.log("400 Bad Request: response from user not found");
                console.error(error);
                response.status(400).send();
                return;
            }

            // if data is ok, we will send the response back to the original phone number
            if (sender && dtmfResponse) {
                response.status(204).send();
                sendResponseSms(sender, dtmfResponse);
            } else {
                console.log("400 Bad Request: response from user not found");
                response.status(400).send();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    }
}