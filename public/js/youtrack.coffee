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


window.youtrack = {
	getIssuesForProject
	getProjects
}