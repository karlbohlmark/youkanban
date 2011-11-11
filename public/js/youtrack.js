(function() {
  var apiCall, executeIssueCommand, extractIssue, getField, getIssuesForProject, getProjectStates, getProjects, localCall;
  var __slice = Array.prototype.slice;
  $.ajaxSetup({
    cache: true
  });
  apiCall = function(options, cb) {
    return $.request.json({
      method: options.method || 'GET',
      url: options.url,
      body: options.body || '',
      headers: options.headers || {
        'x-youkanban-proxy': 'youtrack'
      }
    }, function(err, resp, result) {
      if (cb != null) {
        return cb(result);
      }
    });
  };
  localCall = function(options, cb) {
    options.headers = {};
    return apiCall(options, cb);
  };
  getField = function(fieldName) {
    return function(i) {
      return i.field.filter(function(f) {
        return f['@name'] === fieldName;
      })[0].value;
    };
  };
  extractIssue = function(i) {
    return {
      id: i['@id'],
      title: getField('summary')(i),
      body: getField('description')(i),
      phase: getField('State')(i)
    };
  };
  getIssuesForProject = function(projectId, phases, cb) {
    var deferreds, phase, _i, _len;
    deferreds = [];
    for (_i = 0, _len = phases.length; _i < _len; _i++) {
      phase = phases[_i];
      deferreds.push(apiCall({
        'url': "/rest/issue/byproject/" + projectId + "?filter=State%3A+" + (encodeURIComponent(phase))
      }));
    }
    return jQuery.when.apply(jQuery, deferreds).done(function() {
      var arg, i, issue, issues, issues1, issues2, issues3;
      issues = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      issues = (function() {
        var _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = issues.length; _j < _len2; _j++) {
          arg = issues[_j];
          if (arg[2].responseText !== 'null') {
            _results.push(JSON.parse(arg[2].responseText).issue);
          }
        }
        return _results;
      })();
      issues1 = (function() {
        var _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = issues.length; _j < _len2; _j++) {
          i = issues[_j];
          _results.push((i.length ? i : [i]));
        }
        return _results;
      })();
      issues2 = Array.prototype.concat.apply([], issues1);
      issues3 = (function() {
        var _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = issues2.length; _j < _len2; _j++) {
          issue = issues2[_j];
          if (issue != null) {
            _results.push(extractIssue(issue));
          }
        }
        return _results;
      })();
      return cb(issues3);
    });
  };
  getProjects = function(cb) {
    return apiCall({
      'url': "/rest/project/all"
    }, function(res) {
      return cb(res);
    });
  };
  executeIssueCommand = function(issue, command, cb) {
    return apiCall({
      url: "/rest/issue/" + issue + "/execute",
      method: "POST",
      body: "command=" + command
    }, function(res) {
      if (cb != null) {
        return cb(null, response);
      }
    });
  };
  getProjectStates = function(project, cb) {
    return localCall({
      'url': "/rest/admin/customfield/stateBundle/ExperisStates"
    }, function(response) {
      var phases, state;
      phases = (function() {
        var _i, _len, _ref, _results;
        _ref = response.state;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          state = _ref[_i];
          if (state['@isResolved'] === 'false') {
            _results.push(state['$']);
          }
        }
        return _results;
      })();
      return cb(null, phases);
    });
  };
  window.api = {
    getIssuesForProject: getIssuesForProject,
    getProjects: getProjects,
    executeIssueCommand: executeIssueCommand,
    getProjectStates: getProjectStates
  };
}).call(this);
