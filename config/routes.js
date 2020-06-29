const { handleInboundSms, onInputResponse } = require("../api/VonageController");
const { WEBHOOKS_INBOUND_SMS, WEBHOOKS_DTMF } = require("./urls");

module.exports = function(app){
    app
        .get(WEBHOOKS_INBOUND_SMS, handleInboundSms)
        .post(WEBHOOKS_INBOUND_SMS, handleInboundSms)
        .post(WEBHOOKS_DTMF, onInputResponse);
}