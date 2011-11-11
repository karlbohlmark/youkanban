http = require 'http'

server = http.createServer (req, res)->
	res.writeHead(200,{'content-type': 'text/plain'})
	res.write(JSON.stringify(req.headers))
	res.write(req.url)
	res.end()
	console.log req.headers.cookie

server.listen 8123