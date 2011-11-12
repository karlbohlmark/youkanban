(function() {
  var apiCall, executeIssueCommand, getIssueLabels, getIssuesForProject, getProjectStates, getProjects, isStateLabel, labels, localCall, prettyToUglyLabel, uglyToPrettyLabel;
  labels = [];
  uglyToPrettyLabel = function(label) {
    return label.replace(/_\d+\s/, '');
  };
  prettyToUglyLabel = function(label) {
    return labels.filter(function(l) {
      return uglyToPrettyLabel(l) === label;
    })[0];
  };
  isStateLabel = function(label) {
    return /_.*/.test(label);
  };
  $.ajaxSetup({
    cache: true
  });
  apiCall = function(options, cb) {
    return $.request({
      method: options.method || 'GET',
      url: 'https://api.github.com' + options.url + '?' + document.cookie.replace('oauth-', 'access_')
    }, function(err, resp, result) {
      if (cb != null) {
        return cb(JSON.parse(result));
      }
    });
  };
  localCall = function(options, cb) {
    options.headers = {};
    return apiCall(options, cb);
  };
  getIssuesForProject = function(projectId, phases, cb) {
    var deferreds;
    deferreds = [];
    return apiCall({
      'url': "/repos/karlbohlmark/youkanban/issues"
    }, function(res) {
      var issue, issues, label, phase;
      issues = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = res.length; _i < _len; _i++) {
          issue = res[_i];
          phase = (function() {
            var _j, _len2, _ref, _results2;
            _ref = issue.labels;
            _results2 = [];
            for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
              label = _ref[_j];
              if (phases.indexOf(uglyToPrettyLabel(label.name)) !== -1) {
                _results2.push(uglyToPrettyLabel(label.name));
              }
            }
            return _results2;
          })();
          _results.push({
            title: issue.title,
            body: issue.body,
            id: issue.number,
            phase: phase[0]
          });
        }
        return _results;
      })();
      return cb(issues);
    });
  };
  getProjects = function(cb) {
    return apiCall({
      'url': "/users/karlbohlmark/repos"
    }, function(res) {
      return cb(res);
    });
  };
  getIssueLabels = function(labelname) {
    return apiCall({
      url: "/repos/karlbohlmark/youkanban/issues/" + issue + "/labels",
      json: [labelname]
    }, function(res) {
      if (typeof cb !== "undefined" && cb !== null) {
        return cb(null, response);
      }
    });
  };
  executeIssueCommand = function(issue, fromState, toState, cb) {
    var addLabel, removeLabel;
    removeLabel = prettyToUglyLabel(fromState);
    addLabel = prettyToUglyLabel(toState);
    apiCall({
      url: "/repos/karlbohlmark/youkanban/issues/" + issue + "/labels/" + removeLabel,
      method: 'delete'
    }, function(err) {
      return console.log("removing label " + removeLabel + " " + (err ? ' failed' : 'succeeded'));
    });
    return apiCall({
      url: "/repos/karlbohlmark/youkanban/issues/" + issue + "/labels}",
      method: 'post',
      json: [addLabel]
    }, function(err, resp) {
      return console.log("adding label " + addLabel + " " + (err ? ' failed' : 'succeeded'));
    });
  };
  getProjectStates = function(project, cb) {
    return apiCall({
      'url': "/repos/karlbohlmark/youkanban/labels"
    }, function(response) {
      var label, states;
      states = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = response.length; _i < _len; _i++) {
          label = response[_i];
          if (isStateLabel(label.name)) {
            _results.push(uglyToPrettyLabel(label.name));
          }
        }
        return _results;
      })();
      labels = response.map(function(l) {
        return l.name;
      });
      return cb(null, states);
    });
  };
  window.api = {
    getIssuesForProject: getIssuesForProject,
    getProjects: getProjects,
    executeIssueCommand: executeIssueCommand,
    getProjectStates: getProjectStates
  };
}).call(this);
