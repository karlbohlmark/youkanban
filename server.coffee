express 	= require 'express'
public_dir 	= __dirname + '/public'
httpProxy 	= require 'http-proxy'

config		= require "./config"

port = config.port

app = express.createServer()

app.use express.static(public_dir)

app.set 'views', public_dir + '/views'

# PROXY TO YOUTRACK
httpProxy.createServer( (req, res, proxy) ->
	proxy.proxyRequest req, res,
		host: 'localhost'
		port: if req.url.substr(0, 5) == '/rest' then config.youtrack.port else 8080
).listen(port)


phases = ( {name: phase, tasks:[]} for phase in config.youtrack.phases)

console.log(phases)

# ACTIONS
app.get '/board', (req, res)-> 	res.render 'board.jade', {phases}

app.get '/config', (req, res)-> res.json config


# RUN
app.listen(8080)
