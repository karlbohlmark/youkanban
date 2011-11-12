(function() {
  var app, config, express, host, httpProxy, phase, phases, port, public_dir, request;
  express = require('express');
  public_dir = __dirname + '/public';
  httpProxy = require('http-proxy');
  config = require("./config");
  request = require('request');
  port = config.port;
  host = config.host || 'localhost';
  app = express.createServer();
  app.use(express.static(public_dir));
  app.set('views', public_dir + '/views');
  phases = (function() {
    var _i, _len, _ref, _results;
    _ref = config.api.phases;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      phase = _ref[_i];
      _results.push({
        name: phase,
        tasks: []
      });
    }
    return _results;
  })();
  app.get('/kanban', function(req, res) {
    return res.render('board.jade', {
      phases: phases
    });
  });
  app.get('/config', function(req, res) {
    return res.json(config);
  });
  app.get('/oauth', function(req, res) {
    return request.post({
      url: 'https://github.com/login/oauth/access_token',
      json: {
        client_id: '1875e74c695bc9d36482',
        code: req.get('code'),
        client_secret: 'edc264f96b36bdd3305f92103fbca2c01419380b'
      }
    }, function(err, res, body) {
      console.log(body);
      res.cookie('oauth-token', body);
      return res.redirect('/kanban?authenticated=yup');
    });
  });
  httpProxy.createServer(function(req, res, proxy) {
    return proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: req.url.substr(0, 5) === '/rest' ? 8282 : 8080
    });
  }).listen(port);
  app.use(function(req, res) {
    return request.get({
      url: 'https://api.github.com' + req.url,
      method: req.method,
      headers: {
        'accept': req.headers['accept'],
        'cookie': req.headers['cookie']
      },
      body: req.body
    }, function(err, resp, body) {
      res.writeHead(200, {
        'content-type': resp.headers['content-type']
      });
      res.write(body);
      return res.end();
    });
  });
  app.listen(config.appPort);
}).call(this);
