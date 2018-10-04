
const utils = require('./utilities');
const config = require('./config');
const server = require('./app');

const handler = {

  connectToDatabase: function() {
    if (process.env.NODE_ENV == 'development') {
      return utils.connectToDatabase(config.DEV_DB_URL)
    } else if (process.env.NODE_ENV == 'production') {
      return utils.connectToDatabase(config.PROD_DB_URL)
    }
  },

  init: function(config) {
    return this.connectToDatabase(config).then(() => {
      return server.listen(config.PORT, () => {
        console.log(`< 🏘  running ==> ${config.PORT} >`)
      });
    })
  },

  stop: function(cb) {
    return server.close(cb)
  }
}

// initialise application
handler.init(config)

module.exports = handler;