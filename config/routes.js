const { handleInboundSms } = require("../api/SmsController");

module.exports = function(app){
    app.get('/webhooks/inbound-sms', function(req, res){
        handleInboundSms(req, res);
    });
    /*app.post('/webhooks/inbound-sms', function(req, res){
        handleInboundSms(req, res);
    });*/
}