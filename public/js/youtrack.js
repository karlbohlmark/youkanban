(function() {
  var getIssuesForProject;
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
  window.youtrack = {
    getIssuesForProject: getIssuesForProject
  };
}).call(this);
