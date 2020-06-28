const Nexmo = require('nexmo');
const { API_KEY, API_SECRET, NEXMO_NUMBER, VOICE_API_ID } = require('../config/config');

const nexmo = new Nexmo({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    applicationId: VOICE_API_ID,
    privateKey: './private.key'
});

const appendedTtsMessage = "Press <break time='0.3s' /><prosody volume='loud'>1</prosody><break time='0.3s' /> to Confirm you can join me, or Press <break time='0.3s' /><prosody volume='loud'>2</prosody><break time='0.3s' /> if you cannot join me";

exports.sendTts = function(to, message, responseWebhook) {
    // customize message -> https://developer.nexmo.com/voice/voice-api/guides/customizing-tts
    var ncco = [
        {
            action: 'talk',
            voiceName: 'Joey',
            text: `<speak><break time='0.75s' /> ${message} <break strength='strong' /> ${appendedTtsMessage}</speak>`
        },
        {
            action: 'input',
            eventUrl: responseWebhook,
            dtmf: {
                maxDigits: 1,
                timeOut: 10,
                submitOnHash: true
            }
        },
        {
            action: 'talk',
            voiceName: 'Joey',
            text: 'Thank you for the response!'
        }
    ];

    console.log(`Sending text-to-speech message to ${to}...`);
    nexmo.calls.create(
        {
            to: [{ type: 'phone', number: to }],
            from: { type: 'phone', number: NEXMO_NUMBER },
            ncco
        },
        (err, result) => {
            if (err) {
                console.log(`Error sending text-to-speech message to ${to}:`);
                console.log(err);
                console.log("--------------------");
            } else {
                console.log(`Text-to-speech message to ${to} sent successfully.`);
                console.log(result);
            }
        },
    );
}