getIssuesForProject = (projectId, cb)->
	$.ajax
	    'url': "/rest/issue/byproject/#{projectId}"
	    'success': (res)-> cb(res)
	    'error': (res)-> 
	    	console.log "failed to get issues for #{projectId}"
	    	console.log res
	    'dataType': 'json'

getProjects = (cb)->
	$.ajax
	    'url': "/rest/project/all"
	    'success': (res)-> cb(res)
	    'error': (res)-> 
	    	console.log "failed to get projects"
	    	console.log res
	    'dataType': 'json'

executeIssueCommand = (issue, command, cb)->
	$.ajax
		url: "/rest/issue/#{issue}/execute"
		data: "command=#{command}"
		type: 'POST'
		success: (response)-> cb(null, response) if cb?
		error: (response)-> cb(response) if cb?

getProjectStates = (project, cb) ->
	$.ajax
		'url': "/rest/project/states"
		'dataType': 'json'
		success: (response)-> cb(null, response)
		error: (response)-> cb(response)

window.youtrack = {
	getIssuesForProject
	getProjects
	executeIssueCommand
	getProjectStates
}