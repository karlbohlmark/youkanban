youtrack_port = process.env.YOUTRACK_PORT
youtrack_host = process.env.YOUTRACK_HOST

module.exports = 
	youtrack:
		port: youtrack_port
		host: youtrack_host
		phases: ['Submitted', 'Start Development', 'In Progress', 'Closed', 'In PROD']
		url : "http://#{youtrack_host}:#{youtrack_port}"
	port: 8000