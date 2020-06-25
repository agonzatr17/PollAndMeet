const { PHONE_NUMBERS } = require("../config/config");

module.exports = {
    handleInboundSms: function(request, response) {
        const params = Object.assign(request.query, request.body);
        console.log(params);
        response.status(204).send();
    }
}

// check https://www.nexmo.com/blog/2019/09/16/how-to-send-and-receive-sms-messages-with-node-js-and-express-dr
// check to send messages https://github.com/Nexmo/nexmo-node-code-snippets/blob/master/sms/send-express.js

// how to send message? on the handleInboundSms send a message to all friends (from a list of numbers)

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
