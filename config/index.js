require('dotenv').config();

module.exports = {
  EMAIL_API: 'https://polymailer.herokuapp.com/api/v1',
  PROD_DB_URL: 'mongodb://localhost:27017/lamaison',
  DEV_DB_URL: 'mongodb://localhost:27017/lamaison',
  PORT: process.env.PORT || 7001,
  BS_SECRET: process.env.LA_MAISON_SECRET,
  
  getBaseUrl: function() {
    if (process.env.NODE_ENV == 'development') {
      return 'http://localhost:9900'
    } else if (process.env.NODE_ENV == 'production') {
      return 'http://la-maison.herokuapp.com'
    }
  }
}