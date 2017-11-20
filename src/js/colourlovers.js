var rest = require('restler');

/**
 * HTTP GET request to COLOURlovers API
 * @param  uri
 * @param  options
 * @param  callback
 */
exports.get = function(uri, options, callback) {

	/* If "options" is a function (callback) */
	if(typeof(options) == "function") {
		callback = options;
		options = {
			format: 'json'
		};
	}
	/* If format is not set */
	else if(options.format == null)
		options.format = 'json';

	rest.get('http://www.colourlovers.com/api' + uri, { query: options })
		.on('complete', function(result) {
		
		if(result instanceof Error)
			callback(result);
		else
			callback(null, result);
	});
}
