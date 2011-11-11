getField = (fieldName)-> 
	(i)-> i.field.filter((f)->f['@name']==fieldName)[0]?.value

extractIssue = (i)->
	{ 
		id: i['@id'], 
		title: getField('summary')(i), 
		body: getField('description')(i), 
		phase: getField('State')(i) 
	}

getIssuesForProject = (projectId, phases, cb)->
	deferreds = []
	for phase in phases
		deferreds.push $.ajax(
			'url': "/rest/issue/byproject/#{projectId}?filter=State%3A%7B#{phase.name}%7D"
			'dataType': 'json')

	jQuery.when.apply(jQuery, deferreds).done (issues...)->
		issues = (JSON.parse(arg[2].responseText).issue for arg in issues when arg[2].responseText!='null')
		
		issues1 = ( (if i.length then i else [i])  for i in issues )
		
		issues2 = ( Array.prototype.concat.apply([], issues1) )

		issues3 = ( extractIssue(issue) for issue in issues2 when issue? )
		cb(issues3)

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
		'url': "/rest/admin/customfield/stateBundle/Experis%20States"
		'dataType': 'json'
		success: (response)-> 
			states = ( state['$'] for state in response.state when state['@isResolved']=="false" )
			cb(null, states)
		error: (response)-> cb(response)
###
	$.ajax
		'url': "/rest/project/states"
		'dataType': 'json'
		success: (response)-> cb(null, response)
		error: (response)-> cb(response)
###
	


window.youtrack = {
	getIssuesForProject
	getProjects
	executeIssueCommand
	getProjectStates
}