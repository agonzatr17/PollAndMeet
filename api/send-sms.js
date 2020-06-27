const Nexmo = require('nexmo');
const { API_KEY, API_SECRET, NEXMO_NUMBER, ORIGINAL_NUMBER } = require('../config/config');
 
const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET
});

const appendedMessage = "Please respond with Yes or No if you can join me!";

exports.sendSms = function(to, message) {
    console.log(`Sending message to ${to}...`);
    nexmo.message.sendSms(NEXMO_NUMBER, to, message + " " + appendedMessage, (err, responseData) => {
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

exports.sendResponseSms = function(from, message) {
    console.log(`Sending response message from ${from}...`);
    nexmo.message.sendSms(from, ORIGINAL_NUMBER, message, (err, responseData) => {
        if (err) {
            console.log(`Error sending response message from ${from}:`);
            console.log(err);
            console.log("--------------------");
        } else {
            if (responseData.messages[0]['status'] === "0") {
                console.log(`Response message from ${from} sent successfully.`);
            } else {
                console.log(`Response message from ${from} failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    });
}