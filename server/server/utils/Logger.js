// Library inclusions.
var cp = require('child_process');

// Logger definition.
function Logger() {
	this.loggerWorker = cp.fork(__dirname + '/LoggerWorker');
}

// Kill logger worker.
Logger.prototype.killworker = function() {
	if(this.loggerWorker) {
		try {
			this.loggerWorker.kill();
		}
		catch(e) {
			console.log(msgs.loggerKillErr);
		}
		finally {
			this.loggerWorker = null;
		}
	}
}

// Log
Logger.prototype.log = function(params) {
	this.loggerWorker.send(params);
}

var gLogger = new Logger();

module.exports = gLogger;