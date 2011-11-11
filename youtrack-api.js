httpProxy = require 'http-proxy'


exports.matchesRequest = (req)->
	req.url.substr(0, 5) == '/rest'