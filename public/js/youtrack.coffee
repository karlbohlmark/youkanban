$.ajaxSetup({cache:true})

apiCall = (options, cb)->
	$.request.json 
			method: options.method || 'GET'
			url: options.url
			body: options.body || ''
			headers: options.headers || {'x-youkanban-proxy': 'youtrack'}
		,
			(err, resp, result)->
				cb(result) if cb?

localCall = (options, cb)->
	options.headers = {}
	apiCall options, cb

getField = (fieldName)-> 
	(i)-> i.field.filter((f)->f['@name']==fieldName)[0].value

extractIssue = (i)->
	id: i['@id'], 
	title: getField('summary')(i)
	body: getField('description')(i)
	phase: getField('State')(i)

getIssuesForProject = (projectId, phases, cb)->
	deferreds = []
	for phase in phases
		deferreds.push apiCall
			'url': "/rest/issue/byproject/#{projectId}?filter=State%3A+#{encodeURIComponent(phase)}"

	jQuery.when.apply(jQuery, deferreds).done (issues...)->
		issues = (JSON.parse(arg[2].responseText).issue for arg in issues when arg[2].responseText!='null')
		
		issues1 = ( (if i.length then i else [i])  for i in issues )
		
		issues2 = ( Array.prototype.concat.apply([], issues1) )

		issues3 = ( extractIssue(issue) for issue in issues2 when issue? )
		cb(issues3)

getProjects = (cb)->
	apiCall
			'url': "/rest/project/all"
		,	(res)-> cb(res)

executeIssueCommand = (issue, command, cb)->
	apiCall
			url: "/rest/issue/#{issue}/execute"
			method: "POST"
			body: "command=" + command
		,
			(res)-> cb(null, response) if cb?

getProjectStates = (project, cb) ->
	localCall
			'url': "/rest/admin/customfield/stateBundle/ExperisStates"
		, 
			(response) -> 
				phases = ( state['$'] for state in response.state when state['@isResolved']=='false' )
				cb(null, phases)

window.api = {
	getIssuesForProject
	getProjects
	executeIssueCommand
	getProjectStates
}