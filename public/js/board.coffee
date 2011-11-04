hub = new EventEmitter2({ verbose: true })

model = phases:
			'devStart': [id:1, title: 'capture the flag']
			'working': [{id: 3, title: 'Conquer the world'}]
			'devDone': [{id: 1, title: 'Rescue the princess' }]
			'test': []

'prod':[{id: 4, title: 'Conquer the world'}]

moveEvent = {name: 'task-move', fromPhase:'test', toPhase: 'prod' }


$ ->
	###
	$( '.task' ).draggable(
		revert: true
	)

	$( '.tasks' ).droppable
		activeClass: 'ui-state-hover'
		drop: ( event, ui ) ->
			console.log this
			console.log ui
			ui.draggable.context.style.position = 'static'
			ui.draggable.context.style.top = 0
			ui.draggable.context.style.left = 0
			this.appendChild(ui.draggable.context)
	###


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
			if e.stopPropagation then e.stopPropagation()
			id = e.dataTransfer.getData("Text")
			el = document.getElementById(id)
			p = el.parentNode
			p.removeChild el

			while (p = p.parentNode) && !p.classList.contains('phase')
				console.log p

			hub.emit('task-move', { fromPhase: bin.dataset.phase, toPhase: p.dataset.phase})

			bin.appendChild(el)



			false
			)(bin)
