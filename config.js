const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    answersApiKey: process.env.ANSWERS_API_KEY,
}