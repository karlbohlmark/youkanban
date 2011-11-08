hub = window.hub

#-------------------- DRAG AND DROP -----------------
initDragAndDrop = ()->
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
			
			while (p = p.parentNode) && !p.dataset.phase
				null

			to = bin
			while (to = to.parentNode) && !to.dataset.phase
				null
			hub.emit('task-move', {task: id, toPhase: to.dataset.phase, fromPhase: p.dataset.phase})

			false
			)(bin)
#-------------------/ DRAG AND DROP ----------------
window.board = {initDragAndDrop}
	