var os = require('os');
var Args = require('args-js');
var hash = require('object-hash');

/**
 * Create report instance.
 *
 * @param {Error} [err] - Error to report.
 * @param {Object} [data] - User properties values.
 */
module.exports = function() {
	var exports = {};

	exports.url = 'https://bugflux/',
	exports.project = 'Example application',
	exports.version = '0.1.0',
	exports.system = 'unknown',
	exports.language = 'en_US',
	exports.hash,
	exports.name,
	exports.environment = 'Production',
	exports.stack_trace,
	exports.message,
	exports.client_id;

	/**
	 * Constuctor.
	 *
	 * @param {Array} args
	 */
	var init = function(args) {
		var args = Args([
			{err:  Args.OBJECT | Args.Optional, _type: Error},
			{data: Args.OBJECT | Args.Optional},
		], args);

		if(args.err) exports.fill(args.err);
		for(k in args.data) exports[k] = args.data[k];

		exports.client_id = hash(os.arch() + os.hostname() + os.platform() + os.homedir());
		exports.system = os.platform() +' '+ os.arch();
	}

	/**
	 * Set error-related properties.
	 *
	 * @param {Error} err
	 */
	exports.fill = function(err) {
		if(!(err instanceof Error)) return;

		// Replace absolute paths (eq. A:\user\specific\path\index.js:12:50 -> index.js)
		var stack = err.stack.replace(/\((.*)(\\|\/)([^\\]+):([0-9]+):([0-9]+)\)/g, "($3)");

		exports.hash = hash(stack);
		exports.name = err.name +': '+ err.message;
		exports.stack_trace = err.stack;
	}

	init(arguments);

	return exports;
}