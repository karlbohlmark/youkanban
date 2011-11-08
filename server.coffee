express 	= require 'express'
public_dir 	= __dirname + '/public'
httpProxy 	= require 'http-proxy'

app = express.createServer()

app.use express.static(public_dir)

app.set 'views', public_dir + '/views'

# PROXY TO YOUTRACK
httpProxy.createServer( (req, res, proxy) ->
	proxy.proxyRequest req, res,
		host: 'localhost'
		port: if req.url.substr(0, 5) == '/rest' then 8282 else 8080
).listen(8000)


phases = [
	{
		name:'devStart', 
		tasks:[]
	},
	{
		name:'working', 
		tasks:[]
	},
	{
		name:'devDone', 
		tasks:[]
	}
]


# ACTIONS
app.get '/board', (req, res)-> 
	res.render('board.jade', {
			phases:[]
		}
	)

app.get 'dynamic'

# RUN
app.listen(8080)
