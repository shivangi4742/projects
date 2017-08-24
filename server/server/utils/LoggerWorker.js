// Library inclusions.
var moment = require('moment');
var winston = require('winston');

// Class inclusions.
var config = require('./../configs/Config');

// Worker definition.
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ 
          filename: config.logger.logDir + 'app-' + moment().format('MM-DD-YYYY') + '.log'
        })
    ]
  });

// Log.
process.on('message', function (logParams) {
	if(config.env === 'dev')
		console.log(logParams);
	
    logger.log('info', logParams);
    process.send('done');
});