(function() {
  var executeIssueCommand, extractIssue, getField, getIssuesForProject, getProjectStates, getProjects;
  var __slice = Array.prototype.slice;

  getField = function(fieldName) {
    return function(i) {
      var _ref;
      return (_ref = i.field.filter(function(f) {
        return f['@name'] === fieldName;
      })[0]) != null ? _ref.value : void 0;
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
      deferreds.push($.ajax({
        'url': "/rest/issue/byproject/" + projectId + "?filter=State%3A%7B" + phase.name + "%7D",
        'dataType': 'json'
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
          _results.push(i.length ? i : [i]);
        }
        return _results;
      })();
      issues2 = Array.prototype.concat.apply([], issues1);
      issues3 = (function() {
        var _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = issues2.length; _j < _len2; _j++) {
          issue = issues2[_j];
          if (issue != null) _results.push(extractIssue(issue));
        }
        return _results;
      })();
      return cb(issues3);
    });
  };

  getProjects = function(cb) {
    return $.ajax({
      'url': "/rest/project/all",
      'success': function(res) {
        return cb(res);
      },
      'error': function(res) {
        console.log("failed to get projects");
        return console.log(res);
      },
      'dataType': 'json'
    });
  };

  executeIssueCommand = function(issue, command, cb) {
    return $.ajax({
      url: "/rest/issue/" + issue + "/execute",
      data: "command=" + command,
      type: 'POST',
      success: function(response) {
        if (cb != null) return cb(null, response);
      },
      error: function(response) {
        if (cb != null) return cb(response);
      }
    });
  };

  getProjectStates = function(project, cb) {
    return $.ajax({
      'url': "/rest/admin/customfield/stateBundle/Experis%20States",
      'dataType': 'json',
      success: function(response) {
        var state, states;
        states = (function() {
          var _i, _len, _ref, _results;
          _ref = response.state;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            state = _ref[_i];
            if (state['@isResolved'] === "false") _results.push(state['$']);
          }
          return _results;
        })();
        return cb(null, states);
      },
      error: function(response) {
        return cb(response);
      }
    });
  };

  /*
  	$.ajax
  		'url': "/rest/project/states"
  		'dataType': 'json'
  		success: (response)-> cb(null, response)
  		error: (response)-> cb(response)
  */

  window.youtrack = {
    getIssuesForProject: getIssuesForProject,
    getProjects: getProjects,
    executeIssueCommand: executeIssueCommand,
    getProjectStates: getProjectStates
  };

}).call(this);
