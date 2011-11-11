express 	= require 'express'
public_dir 	= __dirname + '/public'
httpProxy 	= require 'http-proxy'
config		= require "./config"
request 	= require 'request'

port = config.port
host = config.host || 'localhost'

app = express.createServer()

app.use express.static(public_dir)

#app.use express.bodyParser()

app.set 'views', public_dir + '/views'

phases = ( {name: phase, tasks:[]} for phase in config.api.phases)

# ACTIONS
app.get '/kanban', (req, res) -> res.render 'board.jade', {phases}

app.get '/config', (req, res) -> res.json config

app.get '/oauth', (req, res) ->
	request.post
			url: 'https://github.com/login/oauth/access_token'
			json:
				client_id: '1875e74c695bc9d36482'
				code: req.get('code')
				client_secret: 'edc264f96b36bdd3305f92103fbca2c01419380b'
		 ,
		 	(err, res, body)->
		 		console.log(body)
				res.cookie('oauth-token', body)
				res.redirect('/kanban?authenticated=yup')

# PROXY TO YOUTRACK
httpProxy.createServer( (req, res, proxy) ->
	proxy.proxyRequest req, res,
		host: 'localhost'
		port: if req.url.substr(0, 5) == '/rest' then 8282 else 8080
).listen(port)


# EXTERNAL API CALLS
app.use((req, res)->
	request.get(
		url: 'https://api.github.com' + req.url
		method: req.method
		headers: 
			'accept': req.headers['accept']
			'cookie': req.headers['cookie']
		body: req.body
	, (err, resp, body)->
		res.writeHead(200, 'content-type': resp.headers['content-type'])
		res.write(body)
		res.end()
	)
)

# RUN
app.listen(config.appPort)
