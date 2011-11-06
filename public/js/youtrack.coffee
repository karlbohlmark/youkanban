getIssuesForProject = (projectId, cb)->
	$.ajax
	    'url': "/rest/issue/byproject/#{projectId}"
	    'success': (res)-> cb(res)
	    'error': (res)-> 
	    	console.log "failed to get issues for #{projectId}"
	    	console.log res
	    'dataType': 'json'



window.youtrack = {
	getIssuesForProject
}