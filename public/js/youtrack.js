(function() {
  var executeIssueCommand, getIssuesForProject, getProjectStates, getProjects;
  getIssuesForProject = function(projectId, cb) {
    return $.ajax({
      'url': "/rest/issue/byproject/" + projectId,
      'success': function(res) {
        return cb(res);
      },
      'error': function(res) {
        console.log("failed to get issues for " + projectId);
        return console.log(res);
      },
      'dataType': 'json'
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
        if (cb != null) {
          return cb(null, response);
        }
      },
      error: function(response) {
        if (cb != null) {
          return cb(response);
        }
      }
    });
  };
  getProjectStates = function(project, cb) {
    return $.ajax({
      'url': "/rest/project/states",
      'dataType': 'json',
      success: function(response) {
        return cb(null, response);
      },
      error: function(response) {
        return cb(response);
      }
    });
  };
  window.youtrack = {
    getIssuesForProject: getIssuesForProject,
    getProjects: getProjects,
    executeIssueCommand: executeIssueCommand,
    getProjectStates: getProjectStates
  };
}).call(this);
