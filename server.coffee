express 	= require 'express'
#request		= require 'request'
public_dir 	= __dirname
httpProxy 	= require 'http-proxy'

youtrack_login = 'kanban'
youtrack_password = 'kanban'

youtrack_session = ''

app = express.createServer()

app.set 'view options', layout: false

app.use express.static(public_dir)

###
# LOGIN TO YOUTRACK
request.post
	url: 'http://localhost:8282/rest/user/login'
	body: "login=#{youtrack_login}&password=#{youtrack_password}"
	headers: {'content-type': 'application/x-www-form-urlencoded'}
	, (error, res, body) ->
		youtrack_session = res.headers['set-cookie']
		console.log(body)
		console.log youtrack_session
###

# PROXY TO YOUTRACK
httpProxy.createServer( (req, res, proxy) ->
	proxy.proxyRequest req, res,
		host: 'localhost'
		port: if req.url.substr(0, 5) == '/rest' then 8282 else 8080
).listen(8000)


# ACTIONS
app.get '/', (req, res)-> res.render('board.jade')

# RUN
app.listen(8080)
