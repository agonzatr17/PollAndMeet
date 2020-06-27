const { handleInboundSms, sendTtsMessage } = require("../api/SmsController");

module.exports = function(app){
    app.get('/webhooks/inbound-sms', function(req, res) {
        handleInboundSms(req, res);
    });
    /*app.post('/webhooks/inbound-sms', function(req, res){
        handleInboundSms(req, res);
    });*/
    // TTS testing endpoint (TODO: delete)
    app.get('/send-tts', function(req, res) {
        sendTtsMessage(req, res);
    })
}