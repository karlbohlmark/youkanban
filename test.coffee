express =  require 'express'
app = express.createServer()

app.get('/', (req, res)->
	res.json({heyhey:'mymy'})
)

app.listen(8123)