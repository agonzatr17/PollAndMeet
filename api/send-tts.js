const Nexmo = require('nexmo');
const { API_KEY, API_SECRET, NEXMO_NUMBER, VOICE_API_ID } = require('../config/config');

const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  applicationId: VOICE_API_ID,
  privateKey: './private.key'
});

exports.sendTts = function(to, message) {
    var ncco = [
        {
          action: 'talk',
          voiceName: 'Joey',
          text: `<speak><break time='0.75s' />${message}</speak>`,
        },
    ];

    console.log(`Sending text-to-speech message to ${to}...`);
    nexmo.calls.create(
        {
          to: [{ type: 'phone', number: to }],
          from: { type: 'phone', number: NEXMO_NUMBER },
          ncco,
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

// send tts message -> https://dashboard.nexmo.com/getting-started/voice
// customize message -> https://developer.nexmo.com/voice/voice-api/guides/customizing-tts
// read response from keypad  -> https://developer.nexmo.com/voice/voice-api/code-snippets/handle-user-input-with-dtmf
//                            -> https://github.com/Nexmo/nexmo-node-code-snippets/blob/master/voice/dtmf.js 
//                            -> https://developer.nexmo.com/voice/voice-api/ncco-reference#input
//                            -> use this URL [`${request.protocol}://${request.get('host')}/webhooks/dtmf`]
// NCCO reference -> https://developer.nexmo.com/voice/voice-api/ncco-reference

