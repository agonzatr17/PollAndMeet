# sms-poll

This project allows you to create a two-way connection (SMS and voice) between a phone (your phone) and a list of phones (friends, family, co-workers...) using a Vonage phone number. For example, you can send a poll to your friends asking if they can meet you somewhere by sending a single SMS to the Vonage phone number. Then the server will relay the message to each phone number you listed by sending an SMS and a text-to-speech message (call) asking for a response. They can respond by replying to the SMS or by using the keypad if they answered the text-to-speech call. Finally, the response is sent back to your phone.


## Getting Started

These instructions will help you set up the project. See Usage for notes on how to run the project.

### Prerequisites

First of all, you have to sign up at Nexmo (https://dashboard.nexmo.com/sign-up), log in, buy a virtual phone number (https://dashboard.nexmo.com/buy-numbers) and create an application for the Voice API at https://dashboard.nexmo.com/getting-started/voice (download the private.key file generated).

### Setup

Install all the node modules:

```
npm install
```

Create a *'.env'* file and set the variables like this:

```
API_KEY=YOUR_VONAGE_API_KEY
API_SECRET=YOUR_VONAGE_API_SECRET
ORIGINAL_NUMBER=YOUR_PHONE_NUMBER
NEXMO_NUMBER=YOUR_VIRTUAL_PHONE_NUMBER
PHONE_NUMBERS='LIST_OF_PHONE_NUMBERS'
VOICE_API_ID=YOUR_VOICE_API_ID
VOICE_API_KEY_PATH=YOUR_VOICE_API_KEY_PATH
```
Where:
- *YOUR_PHONE_NUMBER* is your phone number with the country code, written with digits only (e.g. 12012345654).
- *LIST_OF_PHONE_NUMBERS* is a list of phone numbers separated by a comma and written with digits only.
- *YOUR_VOICE_API_KEY_PATH* is the path to your private.key file generated in the Prerequisites instructions (e.g. './private.key'). Remember to move the downloaded private.key file to the specified path.

You can find:
- *YOUR_VONAGE_API_KEY* and *YOUR_VONAGE_API_SECRET* at the Nexmo dashboard https://dashboard.nexmo.com/.
- *YOUR_VIRTUAL_PHONE_NUMBER* at https://dashboard.nexmo.com/your-numbers (from the phones you bought in the Prerequisites instructions).
- *YOUR_VOICE_API_ID* at https://dashboard.nexmo.com/applications.


## Usage

Open a terminal, move to the project root and run the script:

```
npm start
```

You can either run it on a public server or on your localhost by using ngrok.

### How to use ngrok

If you want to test the project on your localhost you can use https://ngrok.com/. You can register using your Github account or your e-mail. After logging in, follow the instructions at https://dashboard.ngrok.com/get-started/setup.


### Setting up the webhooks

In order for the project to work, you have to setup the webhooks on the virtual phone number (Nexmo number) you want to use. You can do this by clicking the Manage option of the phone number at https://dashboard.nexmo.com/your-numbers and setting the 'Inbound Webhook URL' to your inbound sms server endpoint (e.g. https://f70e86e4a58f.ngrok.io/webhooks/inbound-sms).

### Test

Once the project is set up and running and the virtual phone number webhook is set, you can test the project by sending an SMS from your phone to the virtual phone number (Nexmo number) you have specified. Next, you will see that your friends are receiving your message and call and answering back to you with an SMS. You can also check the console logs to see the server actions: receiving your message, relaying it to other phones (SMS and call), receiving a response (either an SMS or the keypad input from the call) and sending the response back to your number.


## Accomplishments

Throughout this project development I have learned how to use ngrok and the Vonage/Nexmo API to send/receive SMS and send text-to-speech messages.

### Usage of ngrok

As stated before, I have used ngrok which allows you to expose a local web server to the internet. That helps speeding up the development process since you only have to run a command on the console to set the tunneling and then you are able to test your application webhooks; there is no need to push your changes to your branch, build the application and deploy it on a public server (Azure, AWS...).

### Vonage/Nexmo API

I learnt how to rent (https://dashboard.nexmo.com/buy-numbers) and setup virtual phone numbers (Nexmo numbers) which can be used to send and receive messages or calls. In our project we used this to create a two-way connection (SMS and voice) between a phone and a list of phones (friends).

* The first step was to create an endpoint on my server to receive all the messages that are sent to the virtual phone number. In order to do so, you have to click the Manage option of the phone number at https://dashboard.nexmo.com/your-numbers and set the 'Inbound Webhook URL' to your server endpoint (e.g. https://f70e86e4a58f.ngrok.io/webhooks/inbound-sms).
*  Second, I had to send the received SMS to other phone numbers. I used this method from the Nexmo API:
```
nexmo.message.sendSms(sender, recipient, message, options, callback);
```
 where *sender* is the Nexmo number, *recipient* is one of the friends' phone numbers, *message* is the original message (the one that has been sent to the server) with an appended phrase asking for a response, and *callback* is the callback function which handles the response (in our case it just logs information about the message or the error if there has been any).
* To send the friends' responses back to the server I just used the same endpoint (no code needed). The problem was to send the response back to the original phone number (the one that sent the first message) and since it was the same endpoint I had to add some logic. To solve this problem I checked the sender of the message and if it did not match the original phone number it would send an SMS back to that number (cause it would be a response from a friend!), and if it matched it would be sent to all the friends' phones (cause it would be an original message, the one that starts all this process). The send method is the same as the previous one, but changing the sender to the friend's phone so it will show up in the original phone as his friend's answer, the recipient to the original phone number, and the message to the friend's response (either yes or no).
* Then I implemented the voice functionality to send a text-to-speech message (call). I used the calls create method from the Nexmo API:
```
nexmo.calls.create({
  to: [{
    type: 'phone',
    number: TO_NUMBER
  }],
  from: {
    type: 'phone',
    number: FROM_NUMBER
  },
  MY_NCCO
}, callback);
```
where *TO_NUMBER* is one of the friends' number, *FROM_NUMBER* is the Nexmo number you want to make the call from, *MY_NCCO* is the NCCO object I want to send and callback is the funcion which handles the response (it just logs information about the message or the error). This NCCO object allows us to send a customized text-to-speech message. For example:
```
var ncco = [
    {
        action: 'talk',
        voiceName: 'Joey',
        text: `Hi, this is a message example`
    }
]
```
where the action is to talk, the Joey voice is set and the text to read is defined.
* After the user listens to the text-to-speech message it asks for a keypad input: 1 for yes and 2 for no. To do this I added the input action to the NCCO:
```
{
    action: 'input',
    eventUrl: responseWebhook,
    dtmf: {
        maxDigits: 1,
        timeOut: 10,
        submitOnHash: true
    }
}
```
where *responseWebhook* is the web server endpoint that will handle the user's response and *dtmf* determines the digits it expects (1) and the timeout limit (10 seconds). The *submitOnHash* parameter on true is used to send the response back after pressing the hash key instead of waiting for the *timeOut*.
* To receive the response from the text-to-speech message, we need an endpoint that will handle the request (it is defined on the previous input action: responseWebhook). It then checks out the response and sends a *Confirm* or *Deny* SMS (for 1 or 2 response respectively) to the original phone. If no digit was pressed or the call was not answered, no message is sent.

To sum up, I used the nexmo.message.sendSms and nexmo.calls.create functions to send SMS and text-to-speech messages respectively. To handle the SMS and user's input received the webhooks are defined in the Manage option of the virtual number (https://dashboard.nexmo.com/your-numbers) and the eventUrl of the input action from the text-to-speech message, respectively.


## Future ideas

Here are some ideas to improve the project functionality which can be implemented in the future:

### Automatic Speech Recognition (ASR)
Use voice recognition to listen to the user's response instead of using the keypad (DTMF). Check documentation about ASR: https://developer.nexmo.com/voice/voice-api/guides/asr.

### Implement usability for long messages
Adapt the code to accept long messages (the ones that are split in two or more messages). Check documentation: https://developer.nexmo.com/use-cases/receiving-concat-sms.


## Useful resources

### Using ngrok
* https://dashboard.ngrok.com/get-started/setup
* https://ngrok.com/docs

### Webhooks on Vonage
* https://developer.nexmo.com/concepts/guides/webhooks

### Receiving an SMS (webhooks configuring and code examples)
* https://developer.nexmo.com/messaging/sms/code-snippets/receiving-an-sms
* https://github.com/nexmo/nexmo-node-code-snippets/blob/master/sms/receive-express.js#L7-L18
* https://developer.nexmo.com/api/sms#inbound-sms

### Sending and receiving an SMS
* https://www.nexmo.com/blog/2019/09/16/how-to-send-and-receive-sms-messages-with-node-js-and-express-dr
* https://github.com/Nexmo/nexmo-node-code-snippets/blob/master/sms/send-signed-sms.js

### Voice API and NCCO (Nexmo Call Control Object)
* https://dashboard.nexmo.com/getting-started/voice
* https://developer.nexmo.com/voice/voice-api/ncco-reference
* https://developer.nexmo.com/api/voice

### Sending text-to-speech messages (using NCCO)
* https://developer.nexmo.com/voice/voice-api/guides/ncco
* https://developer.nexmo.com/voice/voice-api/code-snippets/make-an-outbound-call-with-ncco
* https://github.com/Nexmo/nexmo-node-code-snippets/blob/master/voice/make-call-ncco.js

### Customizing text-to-speech messages
* https://developer.nexmo.com/voice/voice-api/guides/text-to-speech
* https://developer.nexmo.com/voice/voice-api/guides/customizing-tts

### Capturing user's response from a call (DTMF)
* https://developer.nexmo.com/voice/voice-api/ncco-reference#input
* https://developer.nexmo.com/voice/voice-api/guides/dtmf
* https://developer.nexmo.com/voice/voice-api/code-snippets/handle-user-input-with-dtmf
* https://github.com/Nexmo/nexmo-node-code-snippets/blob/master/voice/dtmf.js


## Authors

* [agonzatr17](https://github.com/agonzatr17)
