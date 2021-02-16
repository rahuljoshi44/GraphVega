const dotenv = require('dotenv');
dotenv.config();

// general config variables available from .env file, defaulting our API base url to 
// the sandbox, but you can override this in the .env file if you'd like to use the production endpoint
module.exports = {
  API_KEY: process.env.TRADIER_API_KEY,
  API_BASE_URL: process.env.TRADIER_API_BASE_URL || 'https://sandbox.tradier.com/v1/'
};