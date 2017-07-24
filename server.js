"use strict";

const nodeStatic = require('node-static');

const file = new nodeStatic.Server('./public');
require('http').createServer((request, response) => {
	request.addListener('end', () => {
		file.serve(request, response);
	}).resume();
}).listen(process.env.PORT || 3000);