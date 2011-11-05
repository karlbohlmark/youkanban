hub = window.hub
taskFilterChanged = (e) ->
	hub.emit 'task-filter-changed', query: e.target.value

$ ->
	$( '.search' ).on 'keyup', taskFilterChanged
	$( '.search' ).on 'click', taskFilterChanged
	$( '.search' ).on 'change', taskFilterChanged