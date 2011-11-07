(function() {
  var getIssuesForProject, getProjects;
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
  window.youtrack = {
    getIssuesForProject: getIssuesForProject,
    getProjects: getProjects
  };
}).call(this);
