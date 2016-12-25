var Args = require('args-js');
var assert = require('assert');
var request = require('request');

var defaultReport = require('./report')();

const sendUrl = '/api/v1/errors';
const guideUrl = 'http://bugflux.com/guide/reporting-libraries/nodejs.html';

/**
 * Global options.
 *
 * @var {boolean} silent - Do NOT print message to error stream when uncaught exception occurs.
 * @var {boolean} sendUncaughtException - Send uncaught exceptions to bugflux using default settings.
 * @var {boolean} strictSSL - Force to use https protocol and verified certificates.
 */
var options = {
	silent: false,
	sendUncaughtExceptions: true,
	strictSSL: true,
}

/**
 * Alias for settings default values.
 *
 * Instead of:
 * bugflux.default.url = '...';
 * bugflux.default.project = '...';
 * ...
 *
 * Use:
 * bugflux.setDefault({
 *     url: '...',
 *     project: '...',
 *     ...
 * });
 *
 * @param {Object} data - Key-value default settings.
 */
var setDefault = function() {
	var args = Args([
		{data: Args.OBJECT | Args.Required},
	], arguments);

	for(k in args.data) defaultReport[k] = args.data[k];
}

/**
 * Send error report to bugflux server.
 *
 * @param {object} data - Error instance, report or raw object data.
 * @param {object} [callback] - Forward request callback.
 */
var send = function() {
	var args = Args([
		{data:     Args.OBJECT | Args.Required},
		{callback: Args.OBJECT | Args.Optional},
	], arguments);

	// Copy argument if json or report given,
	// otherwise use default report with error details.
	var report = data;
	if(args.data instanceof Error) {
		report = defaultReport;
		report.fill(args.data);
	}

	// Validate report format
	assert(report.project && report.version && report.system && report.language
		&& report.hash && report.name && report.environment && report.stack_trace
		&& report.client_id && report.url, `Invalid format (see ${guideUrl})`);

	// Prepare form data
	var data = {
		project: report.project,
		version: report.version,
		system: report.system,
		language: report.language,
		hash: report.hash,
		name: report.name,
		environment: report.environment,
		stack_trace: report.stack_trace,
		message: report.message,
		client_id: report.client_id,
	};

	// Create request
	request({
		method: 'post',
		uri: report.url + sendUrl,
		form: data,
		strictSSL: options.strictSSL,
	}, function(err, res, body) {
		if(args.callback) args.callback(err, res, body);
	});
}

/**
 * Process uncaught exceptions.
 */
process.on('uncaughtException', (err) => {
	if(options.sendUncaughtExceptions) send(err);
	if(!options.silent) console.error(err);
});

module.exports = {
	report: require('./report'),
	default: defaultReport,
	setDefault: setDefault,
	options: options,
	send: send,
}