labels = []

uglyToPrettyLabel = (label)-> label.replace(/_\d+\s/, '')
prettyToUglyLabel = (label)-> labels.filter((l)-> uglyToPrettyLabel(l)==label)[0]

isStateLabel = (label)-> /_.*/.test label

$.ajaxSetup({cache:true})

apiCall = (options, cb)->
	$.request 
			method: options.method || 'GET'
			url: 'https://api.github.com' + options.url + '?' + document.cookie.replace('oauth-', 'access_')
		,
			(err, resp, result)->
				cb( JSON.parse(result)) if cb?

localCall = (options, cb)->
	options.headers = {}
	apiCall options, cb

getIssuesForProject = (projectId, phases, cb)->
	deferreds = []
	apiCall
			'url': "/repos/karlbohlmark/youkanban/issues"
		,	(res) -> 
				issues = for issue in res
					phase = ( uglyToPrettyLabel( label.name )  for label in issue.labels when phases.indexOf( uglyToPrettyLabel( label.name ) ) != -1 )
					{ title:issue.title, body: issue.body, id:issue.number, phase: phase[0] }
				cb(issues)

getProjects = (cb)->
	apiCall
			'url': "/users/karlbohlmark/repos"
		,	(res)-> cb(res)

getIssueLabels = (labelname)->
	apiCall
			url: "/repos/karlbohlmark/youkanban/issues/#{issue}/labels"
			json: [labelname]
		,
			(res)-> cb(null, response) if cb?

executeIssueCommand = (issue, fromState, toState, cb)->
	removeLabel = prettyToUglyLabel(fromState)
	addLabel = prettyToUglyLabel(toState)
	apiCall
			url: "/repos/karlbohlmark/youkanban/issues/#{issue}/labels/#{removeLabel}"
			method: 'delete'
		,
			(err)->
				console.log "removing label #{removeLabel} #{if err then ' failed' else 'succeeded'}"

	apiCall
			url: "/repos/karlbohlmark/youkanban/issues/#{issue}/labels}"
			method: 'post'
			json: [addLabel]
		,
			(err, resp)->
				console.log "adding label #{addLabel} #{if err then ' failed' else 'succeeded'}"

	

getProjectStates = (project, cb) ->
	apiCall
			'url': "/repos/karlbohlmark/youkanban/labels"
		, (response) -> 
			states = ( uglyToPrettyLabel( label.name )  for label in response when isStateLabel( label.name ) )
			labels = response.map (l)->l.name
			cb(null, states)


window.api = {
	getIssuesForProject
	getProjects
	executeIssueCommand
	getProjectStates
}