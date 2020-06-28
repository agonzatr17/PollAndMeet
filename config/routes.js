const { handleInboundSms, onInputResponse } = require("../api/VonageController");
const { WEBHOOKS_INBOUND_SMS, WEBHOOKS_DTMF } = require("./urls");

module.exports = function(app){
    app.get(WEBHOOKS_INBOUND_SMS, function(req, res) {
        try {
            handleInboundSms(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });
    /*app.post('/webhooks/inbound-sms', function(req, res){
        handleInboundSms(req, res);
    });*/
    app.post(WEBHOOKS_DTMF, function(req, res) {
        try {
            onInputResponse(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).send();
        }
    });
}