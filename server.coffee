express 	= require 'express'
public_dir 	= __dirname + '/public'
httpProxy 	= require 'http-proxy'

app = express.createServer()

app.set 'view options', layout: false

app.use express.static('./public')

# PROXY TO YOUTRACK
httpProxy.createServer( (req, res, proxy) ->
	proxy.proxyRequest req, res,
		host: 'localhost'
		port: if req.url.substr(0, 5) == '/rest' then 8282 else 8123
).listen(8000)

# ACTIONS
app.get '/board', (req, res)-> 
	res.render('board.jade')

# RUN
app.listen(8123)
