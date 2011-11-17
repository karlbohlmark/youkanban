window.hub = new EventEmitter2({ verbose: true })
q = document.querySelectorAll.bind(document)
q1 = document.querySelector.bind(document)
byId = document.getElementById.bind(document)

view =
	getTask: (id)-> byId(id)
	getPhase: (phase)-> q1("[data-phase='#{phase}']")
	getTaskList: (phase)-> q1("[data-phase='#{phase}'] .tasks")
	moveTask: (task, toPhase)->
		task = @getTask(task)
		toPhaseList = @getTaskList(toPhase)
		toPhaseList.appendChild(task)
	

String::contains ?= (s)-> this.indexOf(s)!=-1

hub.on 'task-filter-changed', (filterEvent) ->
	tasks = [].slice.call(q('.task'))
	for task in tasks
		if !task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) then task.classList.add('filtered-out') else task.classList.remove('filtered-out')


hub.on 'task-move', (moveEvent) ->
	#UDPATE YOUTRACK
	youtrack.executeIssueCommand moveEvent.task, moveEvent.toPhase
	
	# MOVE DOM ELEMENT
	view.moveTask(moveEvent.task, moveEvent.toPhase)

# ----------------- EVENTS -----------------



taskViewFn = require('jade').compile """
	li.task(id="\#{id}", class="type-\#{type} prio-\#{prio}", draggable="true")
		header.task-header
			a.issueNumber(href="http://localhost:8282/issue/\#{id}") \#{id}
		h2.title \#{title}
		p.body \#{body}
		.task-footer
			span.assignee \#{assignee}
			.type \#{type}
			.prio \#{prio}
"""

hub.on 'clear-tasks', ->
	$('.task').remove()

hub.on 'task-add', (taskAddEvent) ->
	task = taskAddEvent

	newTask = $(taskViewFn(task))

	newTask.on "dragstart", (e) ->
		e = e.originalEvent
		e.dataTransfer.effectAllowed = "copy"
		e.dataTransfer.setData "Text", @id
		
	phase = $("[data-phase='#{task.phase}']")
	phase.find('.tasks').append(newTask)

hub.on 'load-project', (p) ->
	hub.emit( 'clear-tasks' )

	resource.view 'board.jade', (viewStr)->
		youtrack.getProjectStates p, (_, states)->
			jade = require('jade')
			boardFn = jade.compile(viewStr)
			i=0
			phases = ( { name: state, tasks:[]} for state in states ) #( { name: state['@name'], tasks:[]} for state in states.state when state['@resolved']=="false" )
			rendered = boardFn({phases})
			$('.board').replaceWith($(rendered))
			
			youtrack.getIssuesForProject p, phases, (issues)->
				hub.emit( 'task-add', issue ) for issue in issues 
				window.board.initDragAndDrop()
#--------------------------------------------

#-------------- LOAD ISSUES ----------------
$ ->
	hub.emit('load-project', 'EX')
#-------------------------------------------

#------------------ PROJECT DROPDOWN ---------------
$ ->
	youtrack.getProjects (projects)->
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

	$('.tasks').on 'click', '.task', ->
		location.href = 'http://localhost:8282/issue/' + $(this).attr('id')

	$('.container').on 'dblclick', ->
		if document.body.classList.contains('full-screen') and document.body.webkitExitFullScreen? then document.body.webkitExitFullScreen() else document.body.webkitRequestFullScreen()

	$('.fullScreen').on 'click', ->
		document.body.webkitRequestFullScreen()
	
	document.body.onwebkitfullscreenchange = ->
		this.classList.toggle('full-screen')

	window.board.initDragAndDrop()
	
