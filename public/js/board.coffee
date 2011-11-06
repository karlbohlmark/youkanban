window.hub = new EventEmitter2({ verbose: true })
q = document.querySelectorAll.bind(document)
String::contains ?= (s)-> this.indexOf(s)!=-1

hub.on 'task-filter-changed', (filterEvent) ->
	tasks = [].slice.call(q('.task'))
	for task in tasks
		if !task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) then task.classList.add('filtered-out') else task.classList.remove('filtered-out')


hub.on 'task-move', (moveEvent) ->
	console.log moveEvent

model = phases:[
				name: 'devStart'
				issues: []
			,
				name: 'working'
				issues: []
			,
				name: 'devDone'
				issues: []
			,
				name: 'test'
				issues: []
		]
			
'prod':[{id: 4, title: 'Conquer the world'}]

moveEvent = {name: 'task-move', fromPhase:'test', toPhase: 'prod' }


# ----------------- EVENTS -----------------
hub.on 'task-add', (taskAddEvent) ->
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

getField = (fieldName)-> 
	(i)-> i.field.filter((f)->f['@name']==fieldName)[0].value

extractIssues = (issuesResponse)->
	{ 
		id: i['@id'], 
		title: getField('summary')(i), 
		body: getField('description')(i), 
		phase: getField('State')(i) 
	} for i in issuesResponse.issue

hub.on 'load-project', (p) ->
	youtrack.getIssuesForProject p, (issuesResponse)->
		hub.emit( 'task-add', issue ) for issue in extractIssues(issuesResponse)
#--------------------------------------------


#-------------------- DRAG AND DROP -----------------
$ ->
	tasks = document.querySelectorAll(".task")
	el = null
	t = 0

	while t < tasks.length
		el = tasks[t]
		el.setAttribute "draggable", "true"
		el.addEventListener "dragstart", (e) ->
			e.dataTransfer.effectAllowed = "copy"
			e.dataTransfer.setData "Text", @id
		t++

	bins = [].slice.call( document.querySelectorAll(".tasks") )
	
	for bin in bins
		bin.addEventListener "dragover", (e) ->
			e.preventDefault()  if e.preventDefault
			e.dataTransfer.dropEffect = "copy"
			false

		bin.addEventListener "dragenter", (e) ->
			false

		bin.addEventListener "dragleave", ->

		bin.addEventListener "drop",  ((bin) -> (e) ->
			e.stopPropagation()
			e.preventDefault()
			id = e.dataTransfer.getData("Text")
			el = document.getElementById(id)
			p = el.parentNode
			p.removeChild el

			while (p = p.parentNode) && !p.dataset.phase
				console.log p

			from = bin
			while (from = from.parentNode) && !from.dataset.phase
				console.log from.dataset.phase
			hub.emit('task-move', {task: id, fromPhase: from.dataset.phase, toPhase: p.dataset.phase})

			bin.appendChild(el)

			false
			)(bin)
#-------------------/ DRAG AND DROP ----------------