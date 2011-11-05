window.hub = new EventEmitter2({ verbose: true })
q = document.querySelectorAll.bind(document)
String::contains ?= (s)-> this.indexOf(s)!=-1

hub.on 'task-filter-changed', (filterEvent) ->
	tasks = [].slice.call(q('.task'))
	for task in tasks
		if !task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) then task.classList.add('filtered-out') else task.classList.remove('filtered-out')


hub.on 'task-move', (moveEvent) ->
	console.log moveEvent

model = phases:
			'devStart': [id:1, title: 'capture the flag']
			'working': [{id: 3, title: 'Conquer the world'}]
			'devDone': [{id: 1, title: 'Rescue the princess' }]
			'test': []

'prod':[{id: 4, title: 'Conquer the world'}]

moveEvent = {name: 'task-move', fromPhase:'test', toPhase: 'prod' }


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
