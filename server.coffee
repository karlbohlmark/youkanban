express = require 'express'
stylus = require('stylus');

app = express.createServer()

app.get '/', (req, res)->
	res.render('index', {})

compile = (str, path) ->
  stylus(str)
    .set('filename', path)
    .set('compress', true)

app.use express.static(__dirname)

app.use stylus.middleware(
	src: __dirname + '/public/css'
	compile: compile
)

bundle = require('browserify')(__dirname + '/main.coffee')
app.use(bundle)

app.listen(8080)