window.hub = new EventEmitter2({ verbose: true })
q = document.querySelectorAll.bind(document)
q1 = document.querySelector.bind(document)
byId = document.getElementById.bind(document)

at = hub.on.bind(hub)

view =
	getTask: (id)-> byId(id)
	getPhase: (phase)-> q1("[data-phase='#{phase}']")
	getTaskList: (phase)-> q1("[data-phase='#{phase}'] .tasks")
	moveTask: (task, toPhase)->
		task = @getTask(task)
		toPhaseList = @getTaskList(toPhase)
		toPhaseList.appendChild(task)
	

String::contains ?= (s)-> this.indexOf(s)!=-1

at 'task-filter-changed', (filterEvent) ->
	tasks = [].slice.call(q('.task'))
	for task in tasks
		if !task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) then task.classList.add('filtered-out') else task.classList.remove('filtered-out')


at 'task-move', (moveEvent) ->
	#UDPATE ISSUE
	api.executeIssueCommand moveEvent.task, moveEvent.fromPhase, moveEvent.toPhase
	
	# MOVE DOM ELEMENT
	view.moveTask(moveEvent.task, moveEvent.toPhase)

# ----------------- EVENTS -----------------
at 'clear-tasks', ->
	$('.task').remove()

at 'task-add', (taskAddEvent) ->
	task = taskAddEvent

	newTask = $("""
	<li class="task" id="#{task.id}" draggable="true"><h2 class="title">#{task.title}</h2><p class="body">#{task.body}</p></li>
	""")

	newTask.on "dragstart", (e) ->
		e = e.originalEvent
		e.dataTransfer.effectAllowed = "copy"
		e.dataTransfer.setData "Text", @id
		
	phase = $("[data-phase='#{task.phase}']")
	phase.find('.tasks').append(newTask)

at 'load-project', (p) ->
	hub.emit( 'clear-tasks' )

	resource.view 'board.jade', (viewStr)->
		api.getProjectStates p, (_, states)->
			jade = require('jade')
			boardFn = jade.compile(viewStr)
			i=0
			phases = ( { name: state, tasks:[]} for state in states ) #( { name: state['@name'], tasks:[]} for state in states.state when state['@resolved']=="false" )
			rendered = boardFn({phases})
			$('.board').replaceWith($(rendered))
			
			api.getIssuesForProject p, states, (issues)->
				hub.emit( 'task-add', issue ) for issue in issues 
				window.board.initDragAndDrop()
#--------------------------------------------

#-------------- LOAD ISSUES ----------------
$ ->
	hub.emit('load-project', 'EX')
#-------------------------------------------

#------------------ PROJECT DROPDOWN ---------------
$ ->
	api.getProjects (projects)->
		if(!Array.isArray(projects))
			p = projects.project
			$('.project-chooser')
				.find('.dropdown-menu li').remove().end()
				.find('.dropdown-toggle')
					.text(p['@name'])
					.attr('data-id', p['@shortName'])
					.end()


#-----------------/ PROJECT DROPDOWN ---------------

$ ->
	window.location.href = 'https://github.com/login/oauth/authorize?scope=public_repo&client_id=1875e74c695bc9d36482' unless !!window.location.search

	$('.dropdown-menu').on 'click', 'a', (e)->
		toggle = $(this).closest('.dropdown').find('.dropdown-toggle')
		text = toggle.text()
		id = toggle.attr('data-id')
		toggle
			.text($(this).text())
			.attr('data-id', $(this).attr('data-id'))
		menu = $(this).closest('.dropdown-menu')
		item = $(this).remove()
		item.text(text).attr('data-id', id)
		
		menu.append($('<li></li>').append(item))
		$('.board')
			.removeClass(id)
			.addClass(toggle.attr('data-id'))

	$('body').on 'click', '.task', ->
		location.href = 'http://localhost:8282/issue/' + $(this).attr('id')

	$('.container').on 'dblclick', ->
		if document.body.classList.contains('full-screen') and document.body.webkitExitFullScreen? then document.body.webkitExitFullScreen() else document.body.webkitRequestFullScreen()

	$('.fullScreen').on 'click', ->
		document.body.webkitRequestFullScreen()
	
	document.body.onwebkitfullscreenchange = ->
		this.classList.toggle('full-screen')

	window.board.initDragAndDrop()
	
