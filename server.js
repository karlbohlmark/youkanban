(function() {
  var app, express, httpProxy, phases, public_dir;
  express = require('express');
  public_dir = __dirname + '/public';
  httpProxy = require('http-proxy');
  app = express.createServer();
  app.use(express.static(public_dir));
  app.set('views', public_dir + '/views');
  httpProxy.createServer(function(req, res, proxy) {
    return proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: req.url.substr(0, 5) === '/rest' ? 8282 : 8080
    });
  }).listen(8000);
  phases = [
    {
      name: 'devStart',
      tasks: []
    }, {
      name: 'working',
      tasks: []
    }, {
      name: 'devDone',
      tasks: []
    }
  ];
  app.get('/board', function(req, res) {
    return res.render('board.jade', {
      phases: []
    });
  });
  app.get('dynamic');
  app.listen(8080);
}).call(this);
