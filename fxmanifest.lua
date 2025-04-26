fx_version 'cerulean'
game 'gta5'

client_scripts {
	'build/client/client.js'
}

server_scripts {
	'build/server/server.js'
}

ui_page 'web/dist/index.html'

files {
	'config.json',
	'web/dist/index.html',
	'web/dist/**/*',
	'web/dist/**/**/*'
}