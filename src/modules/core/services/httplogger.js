/*----------------------------------------------------------------------------
    Oct 15 2019   Initial ; Playing with express middleware
----------------------------------------------------------------------------*/

const logger =  require('./logger');

const Version = 'httplogger.js:1.01, Oct 15 2019';

// Define the tracking function called by Express

const httplogger = (req, res, next ) => {
  logger.debug(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
};

module.exports = httplogger;

