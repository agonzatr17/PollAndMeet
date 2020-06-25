const { getPhonesList, displayInboundSms } = require("./phone-utils");
const { sendSms } = require("./send-sms");

module.exports = {
    handleInboundSms: function(request, response) {
        const params = Object.assign(request.query, request.body);
        displayInboundSms(params);

        var phones = getPhonesList();
        phones.forEach( phone => {
            sendSms(phone, params.text);
        });

        response.status(204).send();
    }
}

// how to wait for response? just filter the handleInboundSms to check the from (msisdn)
// -> if (msisdn == myPhone) send message to all friends
// -> else send response to myPhone

// current example:
/*{
  msisdn: '34625496075',
  to: '32460216838',
  messageId: '16000002B61107EC',
  text: 'Join me test',
  type: 'text',
  keyword: 'JOIN',
  'api-key': '974ecc61',
  'message-timestamp': '2020-06-22 21:54:58'
}*/
