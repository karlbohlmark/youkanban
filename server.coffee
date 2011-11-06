express 	= require 'express'
bouncy 		= require 'bouncy'
request		= require 'request'
public_dir 	= __dirname
jade 		= require 'jade'
fs			= require 'fs'

youtrack_login = 'karl'
youtrack_password = 'karlbohlmark'

youtrack_session = ''

app = express.createServer()

app.set 'view options', layout: false

app.use express.static(public_dir)



# LOGIN TO YOUTRACK
request.post
	url: 'http://localhost:8282/rest/login'
	body: "login=#{youtrack_login}&password=#{youtrack_password}"
	, (error, res, body) ->
		youtrack_session = res.headers['set-cookie']
		console.log(error)
		console.log(JSON.stringify(res.headers))
		console.log youtrack_session

# PROXY TO YOUTRACK
bouncy( (req, bounce) -> 
	if (req.url.substr(0, 5) == '/rest') then bounce(8282, { headers:{ 'set-cookie': youtrack_session } }) else bounce(8080)
).listen(8000)

# ACTIONS
app.get '/', (req, res)-> res.render('board.jade')

app.get '/view/:viewName', (req, res) -> 
	v = fs.readFileSync('views/' + req.param('viewName'))
	fn = jade.compile(v.toString(), {filename: 'board.jade'})
	
	res.send(fn.toString())
	res.end()

# RUN
app.listen(8080)
