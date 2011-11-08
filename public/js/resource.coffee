fetch = (url, cb)->
	$.ajax
		url: url
		success: (r)->cb(r)

resource =
	view: (view, cb)-> fetch("/views/#{view}", cb)

window.resource = resource