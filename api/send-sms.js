const Nexmo = require('nexmo');
const { API_KEY, API_SECRET, NEXMO_NUMBER } = require('../config/config');
 
const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET
});

exports.sendSms = function(to, message) {
    console.log(`Sending message to ${to}...`);
    nexmo.message.sendSms(NEXMO_NUMBER, to, message, (err, responseData) => {
        if (err) {
            console.log(`Error sending message to ${to}:`);
            console.log(err);
            console.log("--------------------");
        } else {
            if (responseData.messages[0]['status'] === "0") {
                console.log(`Message to ${to} sent successfully.`);
            } else {
                console.log(`Message to ${to} failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    });
}