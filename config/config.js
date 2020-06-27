const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  ORIGINAL_NUMBER: process.env.ORIGINAL_NUMBER,
  NEXMO_NUMBER: process.env.NEXMO_NUMBER,
  PHONE_NUMBERS: process.env.PHONE_NUMBERS,
  VOICE_API_ID: process.env.VOICE_API_ID
};